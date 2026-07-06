export async function POST(request: Request) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return Response.json({ ok: false }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const downloadLocation = body?.downloadLocation;
  if (typeof downloadLocation !== "string" || !downloadLocation.startsWith("https://api.unsplash.com/")) {
    return Response.json({ ok: false }, { status: 400 });
  }

  fetch(downloadLocation, { headers: { Authorization: `Client-ID ${key}` } }).catch(() => {});
  return Response.json({ ok: true });
}
