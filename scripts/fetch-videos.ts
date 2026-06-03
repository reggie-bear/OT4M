import 'dotenv/config'
import { google } from 'googleapis'
import fs from 'fs'

const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY })
const CHANNEL_ID = process.env.OT4M_CHANNEL_ID!

async function fetchAllVideos() {
  // Get uploads playlist
  const channelRes = await youtube.channels.list({
    part: ['contentDetails'],
    id: [CHANNEL_ID],
  })
  const uploadsPlaylistId = channelRes.data.items?.[0].contentDetails?.relatedPlaylists?.uploads!

  // Get all video IDs
  const videoIds: string[] = []
  let pageToken: string | undefined
  do {
    const res = await youtube.playlistItems.list({
      part: ['snippet'],
      playlistId: uploadsPlaylistId,
      maxResults: 50,
      pageToken,
    })
    for (const item of res.data.items ?? []) {
      const id = item.snippet?.resourceId?.videoId
      if (id) videoIds.push(id)
    }
    pageToken = res.data.nextPageToken ?? undefined
  } while (pageToken)

  console.log(`Found ${videoIds.length} videos. Fetching details...`)

  // Fetch full details in batches of 50
  const videos: any[] = []
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50)
    const res = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: batch,
    })
    videos.push(...(res.data.items ?? []))
    process.stdout.write(`  fetched ${Math.min(i + 50, videoIds.length)}/${videoIds.length}\r`)
  }

  // Format for sheet
  const rows = videos.map(v => ({
    videoId:     v.id,
    title:       v.snippet?.title ?? '',
    publishedAt: v.snippet?.publishedAt?.slice(0, 10) ?? '',
    description: (v.snippet?.description ?? '').replace(/\n/g, ' ').slice(0, 500),
    duration:    v.contentDetails?.duration ?? '',
    views:       v.statistics?.viewCount ?? '0',
    likes:       v.statistics?.likeCount ?? '0',
    comments:    v.statistics?.commentCount ?? '0',
    tags:        (v.snippet?.tags ?? []).join(', '),
    url:         `https://youtube.com/watch?v=${v.id}`,
  }))

  // Sort newest first
  rows.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

  fs.writeFileSync('/tmp/ot4m-videos.json', JSON.stringify(rows, null, 2))
  console.log(`\nSaved ${rows.length} videos to /tmp/ot4m-videos.json`)
}

fetchAllVideos().catch(console.error)
