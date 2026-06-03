import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()
    if (!query?.trim()) return NextResponse.json({ results: [] })

    // Embed the query
    const model = genai.getGenerativeModel({ model: 'gemini-embedding-2' })
    const { embedding } = await model.embedContent({
      content: { parts: [{ text: query }], role: 'user' },
      taskType: 'RETRIEVAL_QUERY' as any,
      outputDimensionality: 1536,
    } as any)

    // Call Supabase RPC directly via REST — no SDK, no WebSocket init
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/search_ot4m`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
      },
      body: JSON.stringify({
        query_embedding: embedding.values,
        match_count: 8,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json({ error: err }, { status: 500 })
    }

    const data = await res.json()

    const results = data.map((row: any) => {
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
  } catch (err: any) {
    console.error('Search error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
