import { shapePhoto } from "@/lib/unsplash";

export async function GET(request: Request) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();
  if (!query) {
    return Response.json({ error: "missing_query" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=9&orientation=landscape`,
    { headers: { Authorization: `Client-ID ${key}` } },
  );
  if (!res.ok) {
    return Response.json({ error: "upstream_error" }, { status: 502 });
  }

  const data = await res.json();
  const results = (data.results ?? []).map(shapePhoto);
  return Response.json({ results });
}
