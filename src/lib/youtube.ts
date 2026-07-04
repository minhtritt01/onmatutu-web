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
