import { NextRequest, NextResponse } from "next/server";
import { embedQuery, searchVideos, generateAnswer, toVideoMatch } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== "string" || query.trim().length < 2) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const q = query.trim().slice(0, 500);

    const queryEmbedding = await embedQuery(q);
    const topVideos      = await searchVideos(queryEmbedding, 5);
    const answer         = await generateAnswer(q, topVideos);
    const videos         = topVideos.map(({ video, score }) => toVideoMatch(video, score, q));

    return NextResponse.json({ answer, videos, query: q });
  } catch (err: any) {
    console.error("Search error:", err);
    return NextResponse.json({
      error: "Search failed. Please try again.",
      detail: String(err?.message || err),
      env: {
        gemini: !!process.env.GEMINI_API_KEY,
        supaUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supaKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    }, { status: 500 });
  }
}
