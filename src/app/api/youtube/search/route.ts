import { shapeYoutubeSearchResult } from "@/lib/youtube";

export async function GET(request: Request) {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();
  if (!query) {
    return Response.json({ error: "missing_query" }, { status: 400 });
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=9&q=${encodeURIComponent(query)}&key=${key}`,
  );
  if (!res.ok) {
    return Response.json({ error: "upstream_error" }, { status: 502 });
  }

  const data = await res.json();
  const results = (data.items ?? []).map(shapeYoutubeSearchResult);
  return Response.json({ results });
}
