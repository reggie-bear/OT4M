import 'dotenv/config'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import { YoutubeTranscript } from 'youtube-transcript'
import { google } from 'googleapis'
import ws from 'ws'

const CHANNEL_ID = process.env.OT4M_CHANNEL_ID!
const CHUNK_SIZE = 500
const CHUNK_OVERLAP = 50
const CALL_DELAY_MS = 600     // ms between each embedding call

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { realtime: { transport: ws } }
)
const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY })

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))

// ── Fetch all video IDs from channel ─────────────────────────────────────────

async function fetchChannelVideos() {
  const channelRes = await youtube.channels.list({
    part: ['contentDetails'],
    id: [CHANNEL_ID],
  })
  const uploadsPlaylistId = channelRes.data.items?.[0].contentDetails?.relatedPlaylists?.uploads
  if (!uploadsPlaylistId) throw new Error('Could not find uploads playlist')

  const videos: { id: string; title: string; publishedAt: string; thumbnail: string }[] = []
  let pageToken: string | undefined

  do {
    const res = await youtube.playlistItems.list({
      part: ['snippet'],
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      pageToken,
    })

    for (const item of res.data.items ?? []) {
      const videoId = item.snippet?.resourceId?.videoId
      if (!videoId) continue
      videos.push({
        id: videoId,
        title: item.snippet?.title ?? '',
        publishedAt: item.snippet?.publishedAt ?? '',
        thumbnail: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? '',
      })
    }

    pageToken = res.data.nextPageToken ?? undefined
  } while (pageToken)

  return videos
}

// ── Chunk transcript into ~500-word segments ──────────────────────────────────

function chunkTranscript(transcript: { text: string; offset: number; duration?: number }[]) {
  const chunks: { text: string; start: number; end: number }[] = []
  let words: string[] = []
  let chunkStart = transcript[0]?.offset ?? 0
  let lastEnd = transcript[0]?.offset ?? 0

  for (const entry of transcript) {
    const entryWords = entry.text.replace(/\n/g, ' ').split(' ').filter(Boolean)
    words.push(...entryWords)
    const duration = typeof entry.duration === 'number' && isFinite(entry.duration) ? entry.duration : 0
    lastEnd = entry.offset + duration

    if (words.length >= CHUNK_SIZE) {
      chunks.push({ text: words.join(' '), start: Math.floor(chunkStart), end: Math.floor(lastEnd) })
      words = words.slice(words.length - CHUNK_OVERLAP)
      chunkStart = entry.offset
    }
  }

  if (words.length > 0) {
    chunks.push({ text: words.join(' '), start: Math.floor(chunkStart), end: Math.floor(lastEnd) })
  }

  return chunks
}

// ── Embed a batch of texts with retry on 429 ─────────────────────────────────

async function embedWithRetry(model: any, text: string, retries = 5): Promise<number[]> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await model.embedContent({
        content: { parts: [{ text }], role: 'user' },
        taskType: 'RETRIEVAL_DOCUMENT' as any,
        outputDimensionality: 1536,
      } as any)
      return res.embedding.values
    } catch (err: any) {
      if (err?.status === 429) {
        const wait = 10000 * (attempt + 1) // 10s, 20s, 30s...
        console.log(`\n  ⏳ Rate limited — waiting ${wait / 1000}s...`)
        await sleep(wait)
      } else {
        throw err
      }
    }
  }
  throw new Error('Max retries exceeded on embedding')
}

async function embedBatch(texts: string[]): Promise<number[][]> {
  const model = genai.getGenerativeModel({ model: 'gemini-embedding-2' })
  const results: number[][] = []

  for (let i = 0; i < texts.length; i++) {
    const embedding = await embedWithRetry(model, texts[i])
    results.push(embedding)
    process.stdout.write(`  embedded ${i + 1}/${texts.length} chunks\r`)
    await sleep(CALL_DELAY_MS)
  }

  return results
}

// ── Main ingestion loop ───────────────────────────────────────────────────────

async function main() {
  console.log('Fetching channel videos...')
  const allVideos = await fetchChannelVideos()
  console.log(`Found ${allVideos.length} videos`)

  const { data: existing } = await supabase.from('ot4m_videos').select('id')
  const existingIds = new Set(existing?.map(r => r.id) ?? [])
  const toProcess = allVideos.filter(v => !existingIds.has(v.id))
  console.log(`${existingIds.size} already ingested, ${toProcess.length} to process\n`)

  for (let i = 0; i < toProcess.length; i++) {
    const video = toProcess[i]
    console.log(`[${i + 1}/${toProcess.length}] ${video.title}`)

    let transcript
    try {
      transcript = await YoutubeTranscript.fetchTranscript(video.id)
    } catch {
      console.log(`  ⚠ No transcript — skipping`)
      continue
    }

    if (!transcript.length) {
      console.log(`  ⚠ Empty transcript — skipping`)
      continue
    }

    const chunks = chunkTranscript(transcript)
    console.log(`  ${chunks.length} chunks`)

    const embeddings = await embedBatch(chunks.map(c => c.text))
    console.log()

    await supabase.from('ot4m_videos').upsert({
      id: video.id,
      title: video.title,
      published_at: video.publishedAt,
      thumbnail_url: video.thumbnail,
    })

    const rows = chunks.map((chunk, idx) => ({
      video_id: video.id,
      chunk_index: idx,
      timestamp_start: chunk.start,
      timestamp_end: chunk.end,
      text: chunk.text,
      embedding: JSON.stringify(embeddings[idx]),
    }))

    const { error } = await supabase.from('ot4m_chunks').insert(rows)
    if (error) console.error(`  ✗ DB error:`, error.message)
    else console.log(`  ✓ saved`)
  }

  console.log('\nDone.')
}

main().catch(console.error)
