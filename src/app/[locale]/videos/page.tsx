import { type Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { localePath } from "@/i18n/routing";
import { siteConfig } from "@/lib/site-config";
import { getAllVideos } from "@/lib/videos";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "videos" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${siteConfig.url}${localePath(locale, "/videos")}`,
      languages: {
        vi: `${siteConfig.url}/videos`,
        en: `${siteConfig.url}/en/videos`,
      },
    },
  };
}

export default async function VideosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("videos");
  const videos = getAllVideos(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">{t("title")}</h1>
      <p className="mb-8 text-sm text-foreground/60">{t("description")}</p>

      {videos.length === 0 ? (
        <p className="text-foreground/60">{t("noPosts")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {videos.map((video) => {
            const thumb = video.frontmatter.characterImages?.[0];
            const dateLabel = new Date(video.frontmatter.date).toLocaleDateString(
              locale === "vi" ? "vi-VN" : "en-US",
              { day: "numeric", month: "long", year: "numeric" }
            );
            return (
              <Link
                key={video.slug}
                href={`/videos/${video.slug}`}
                className="group flex flex-col gap-2"
              >
                {thumb && (
                  <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-brand-gray/20">
                    <Image
                      src={thumb}
                      alt={video.frontmatter.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs text-foreground/50">{dateLabel}</p>
                  <p className="mt-0.5 text-sm font-medium leading-snug group-hover:text-brand-navy">
                    {video.frontmatter.title}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
