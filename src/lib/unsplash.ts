export interface UnsplashPhoto {
  id: string;
  thumbUrl: string;
  regularUrl: string;
  photographerName: string;
  photographerProfileUrl: string;
  downloadLocation: string;
}

interface UnsplashRawPhoto {
  id: string;
  urls: { small: string; regular: string };
  user: { name: string; links: { html: string } };
  links: { download_location: string };
}

/** Server-only: shapes a raw Unsplash API photo into the slim shape sent to the client. */
export function shapePhoto(raw: UnsplashRawPhoto): UnsplashPhoto {
  return {
    id: raw.id,
    thumbUrl: raw.urls.small,
    regularUrl: raw.urls.regular,
    photographerName: raw.user.name,
    photographerProfileUrl: `${raw.user.links.html}?utm_source=on-ma-tu-tu&utm_medium=referral`,
    downloadLocation: raw.links.download_location,
  };
}

/** Client: searches photos via our server-side proxy (keeps the Unsplash key off the client). */
export async function searchUnsplash(query: string): Promise<UnsplashPhoto[]> {
  const res = await fetch(`/api/unsplash/search?query=${encodeURIComponent(query)}`);
  if (res.status === 503) throw new Error("not_configured");
  if (!res.ok) throw new Error("unsplash_search_failed");
  const data = await res.json();
  return data.results as UnsplashPhoto[];
}

/** Client: fire-and-forget download-tracking ping, required by Unsplash's API guidelines when a photo is used. */
export function trackUnsplashDownload(downloadLocation: string): void {
  fetch("/api/unsplash/track-download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ downloadLocation }),
  }).catch(() => {});
}
