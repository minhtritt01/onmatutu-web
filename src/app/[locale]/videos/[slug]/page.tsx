import { type Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, localePath } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { getAllVideoSlugs, getVideoBySlug } from "@/lib/videos";
import { MDXRemote } from "@/components/MDXRemote";

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllVideoSlugs(locale).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const video = getVideoBySlug(slug, locale);
  if (!video) return {};

  const url = `${siteConfig.url}${localePath(locale, `/videos/${slug}`)}`;
  return {
    title: video.frontmatter.title,
    description: video.frontmatter.description,
    alternates: {
      canonical: url,
      languages: {
        vi: `${siteConfig.url}/videos/${slug}`,
        en: `${siteConfig.url}/en/videos/${slug}`,
      },
    },
    openGraph: {
      type: "article",
      locale: locale === "vi" ? "vi_VN" : "en_US",
      url,
      title: video.frontmatter.title,
      description: video.frontmatter.description,
      publishedTime: video.frontmatter.date,
      images: video.frontmatter.characterImages?.[0]
        ? [{ url: `${siteConfig.url}${video.frontmatter.characterImages[0]}` }]
        : undefined,
    },
  };
}

const PLATFORM_LABELS: Record<string, string> = {
  tiktok: "TikTok",
  youtube: "YouTube",
  facebook: "Facebook",
  instagram: "Instagram",
};

export default async function VideoDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("videos");
  const video = getVideoBySlug(slug, locale);
  if (!video) notFound();

  const { frontmatter, content } = video;
  const dateLocale = locale === "vi" ? "vi-VN" : "en-US";
  const activeUrls = Object.entries(frontmatter.videoUrls ?? {}).filter(
    ([, v]) => v && v.length > 0
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: frontmatter.title,
    description: frontmatter.description,
    uploadDate: frontmatter.date,
    author: { "@type": "Organization", name: siteConfig.name },
    ...(activeUrls[0] ? { contentUrl: activeUrls[0][1] } : {}),
  };

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Header */}
      <p className="text-xs font-medium uppercase tracking-wide text-brand-navy">
        {frontmatter.topic}
      </p>
      <h1 className="mt-2 text-3xl font-semibold">{frontmatter.title}</h1>
      <p className="mt-2 text-sm text-foreground/60">
        {new Date(frontmatter.date).toLocaleDateString(dateLocale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>

      {/* 3 character images — horizontal scroll on mobile, row on desktop */}
      {frontmatter.characterImages?.length > 0 && (
        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {frontmatter.characterImages.map((src, i) => (
            <div
              key={i}
              className="relative flex-none w-[160px] snap-start overflow-hidden rounded-2xl shadow-md"
              style={{ aspectRatio: "9/16" }}
            >
              <Image
                src={src}
                alt={`${frontmatter.title} — ${i + 1}`}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
          ))}
        </div>
      )}

      {/* MDX story body */}
      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <MDXRemote source={content} />
      </div>

      {/* Platform links — only shown when at least one URL is filled */}
      {activeUrls.length > 0 && (
        <div className="mt-10 border-t border-brand-gray pt-6">
          <p className="mb-3 text-sm font-medium text-foreground/70">{t("watchOn")}</p>
          <div className="flex flex-wrap gap-3">
            {activeUrls.map(([platform, url]) => (
              <a
                key={platform}
                href={url!}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-brand-gray px-4 py-1.5 text-sm transition hover:bg-brand-gray/20"
              >
                {PLATFORM_LABELS[platform] ?? platform}
              </a>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
