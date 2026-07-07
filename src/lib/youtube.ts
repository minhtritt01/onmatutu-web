const YOUTUBE_ID_PATTERNS = [
  /youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /[?&]v=([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
];

/** Extracts a YouTube video ID from watch/short/embed/share URL forms, or returns null if invalid. */
export function parseYoutubeId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  for (const pattern of YOUTUBE_ID_PATTERNS) {
    const match = trimmed.match(pattern);
    if (match) return match[1];
  }

  return null;
}

export interface YoutubeSearchResult {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
}

interface YoutubeRawSearchItem {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { default: { url: string } };
  };
}

/** Server-only: shapes a raw YouTube Data API search item into the slim shape sent to the client. */
export function shapeYoutubeSearchResult(raw: YoutubeRawSearchItem): YoutubeSearchResult {
  return {
    videoId: raw.id.videoId,
    title: raw.snippet.title,
    thumbnailUrl: raw.snippet.thumbnails.default.url,
    channelTitle: raw.snippet.channelTitle,
  };
}

/** Client: searches YouTube via our server-side proxy (keeps the API key off the client). */
export async function searchYoutube(query: string): Promise<YoutubeSearchResult[]> {
  const res = await fetch(`/api/youtube/search?query=${encodeURIComponent(query)}`);
  if (res.status === 503) throw new Error("not_configured");
  if (!res.ok) throw new Error("youtube_search_failed");
  const data = await res.json();
  return data.results as YoutubeSearchResult[];
}
