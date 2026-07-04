import { siteConfig } from "@/lib/site-config";

/** Shared openGraph/twitter fields for pages that only need a title + description + url. */
export function socialMetadata({
  locale,
  url,
  title,
  description,
}: {
  locale: string;
  url: string;
  title: string;
  description: string;
}) {
  const ogLocale = locale === "vi" ? "vi_VN" : "en_US";
  return {
    openGraph: {
      type: "website" as const,
      locale: ogLocale,
      url,
      siteName: siteConfig.name,
      title,
      description,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
}
