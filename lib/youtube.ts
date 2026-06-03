export interface YTVideo {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  watchUrl: string;
}

const CHANNEL_ID = "UCpeG4DnEg6oHqc1AQ-rQ-DA";

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/\r?\n/g, " ")
    .trim();
}

export async function getLatestVideos(count = 6): Promise<YTVideo[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { next: { revalidate: 3600 } } // re-fetch at most once per hour
    );
    if (!res.ok) return [];
    const xml = await res.text();

    const entries = xml.split("<entry>").slice(1);

    return entries.slice(0, count).map((entry): YTVideo => {
      const videoId    = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const title      = decodeEntities(entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? "");
      const published  = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
      const rawDesc    = entry.match(/<media:description>([\s\S]*?)<\/media:description>/)?.[1] ?? "";
      const description = decodeEntities(rawDesc).slice(0, 220);

      return {
        videoId,
        title,
        description,
        publishedAt: published,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
        watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });
  } catch {
    return [];
  }
}
