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
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Search failed. Please try again." }, { status: 500 });
  }
}
