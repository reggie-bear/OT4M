export interface VideoEmbed {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  transcript: string;
  embedding?: number[];
}

export interface SearchResult {
  answer: string;
  videos: VideoMatch[];
  query: string;
}

export interface VideoMatch {
  videoId: string;
  title: string;
  description: string;
  publishedAt: string;
  thumbnailUrl: string;
  relevanceScore: number;
  snippet?: string;
}
