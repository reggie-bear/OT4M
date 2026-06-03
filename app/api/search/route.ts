export const runtime = 'edge'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const { query } = await req.json()
  if (!query?.trim()) return NextResponse.json({ results: [] })

  // Embed the search query
  const model = genai.getGenerativeModel({ model: 'gemini-embedding-2' })
  const { embedding } = await model.embedContent({
    content: { parts: [{ text: query }], role: 'user' },
    taskType: 'RETRIEVAL_QUERY' as any,
    outputDimensionality: 1536,
  } as any)

  const vector = JSON.stringify(embedding.values)

  // Similarity search in Supabase
  const { data, error } = await supabase.rpc('search_ot4m', { query_embedding: vector, match_count: 8 })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = data.map((row: any) => {
    // youtube-transcript returns ms for some videos, seconds for others
    const seconds = row.timestamp_start > 100000
      ? Math.floor(row.timestamp_start / 1000)
      : row.timestamp_start
    return {
      video_id: row.video_id,
      title: row.title,
      thumbnail_url: row.thumbnail_url,
      timestamp_start: seconds,
      text: row.text,
      similarity: row.similarity,
      url: `https://youtube.com/watch?v=${row.video_id}&t=${seconds}`,
    }
  })

  return NextResponse.json({ results })
}
