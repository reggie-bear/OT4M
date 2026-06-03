import { GoogleGenerativeAI } from "@google/generative-ai";
import { VideoEmbed, VideoMatch } from "./types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const EMBED_MODEL = "gemini-embedding-2";
const GEN_MODEL   = "gemini-2.0-flash";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ── Embed query with Gemini Embedding 2 (1536 dims to match our pgvector schema)
export async function embedQuery(query: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: EMBED_MODEL });
  const result = await model.embedContent({
    content: { parts: [{ text: query }], role: "user" },
    taskType: "RETRIEVAL_QUERY" as any,
    outputDimensionality: 1536,
  } as any);
  return result.embedding.values;
}

// ── Search Supabase pgvector via REST (no SDK — avoids WebSocket init on Node 20)
export async function searchVideos(
  queryEmbedding: number[],
  topK = 5
): Promise<{ video: VideoEmbed; score: number }[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/search_ot4m`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
    body: JSON.stringify({ query_embedding: queryEmbedding, match_count: topK }),
  });

  if (!res.ok) throw new Error(`Supabase search failed: ${res.status}`);
  const rows = await res.json();

  return rows.map((row: any) => ({
    score: row.similarity,
    video: {
      videoId:     row.video_id,
      title:       row.title,
      description: "",
      publishedAt: "",
      thumbnailUrl: row.thumbnail_url,
      transcript:  row.text,
      embedding:   [],
    } satisfies VideoEmbed,
  }));
}

// ── Generate a grounded answer with Gemini Flash
export async function generateAnswer(
  query: string,
  topVideos: { video: VideoEmbed; score: number }[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: GEN_MODEL });

  const context = topVideos
    .map(({ video }, i) => `[Excerpt ${i + 1}]: "${video.title}"\n${video.transcript.slice(0, 2000)}`)
    .join("\n\n---\n\n");

  const prompt = `You are an assistant for One Thing for Men, a Christian men's ministry in Alpharetta, Georgia that has been spurring men on to a closer walk with God since 2009. You answer questions based solely on the ministry's teaching content.

Answer this question concisely and directly, grounded in the biblical teaching excerpts below. Write in a warm but direct tone — like an older brother in faith, not a therapist. Keep your answer to 3–5 sentences. Do not cite video titles or numbers in your answer.

Question: "${query}"

Teaching excerpts:
${context}

Answer:`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

// ── Shape a VideoEmbed into the VideoMatch the UI expects
export function toVideoMatch(
  video: VideoEmbed,
  score: number,
  query: string
): VideoMatch {
  const words     = query.toLowerCase().split(/\s+/);
  const sentences = video.transcript.split(/(?<=[.!?])\s+/);
  const snippet   =
    sentences.find((s) => words.some((w) => s.toLowerCase().includes(w))) ||
    sentences[0];

  return {
    videoId:       video.videoId,
    title:         video.title,
    description:   video.description,
    publishedAt:   video.publishedAt,
    thumbnailUrl:  video.thumbnailUrl,
    relevanceScore: score,
    snippet:       snippet?.slice(0, 200) || "",
  };
}
