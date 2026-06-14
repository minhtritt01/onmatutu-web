import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("title"),
    description: t("description", { siteName: siteConfig.name }),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/about`,
      languages: {
        vi: `${siteConfig.url}/vi/about`,
        en: `${siteConfig.url}/en/about`,
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("about");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">
        {t("heading", { siteName: siteConfig.name })}
      </h1>

      <div className="mb-6 flex justify-center">
        <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-2 border-brand-yellow">
          <Image
            src="/character/phoenix-peaceful.jpg"
            alt={t("charAlt")}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <strong>{siteConfig.name}</strong> ({siteConfig.hashtag}) {t("p1")}
        </p>
        <p>{t("p2")}</p>
        <p>{t("p3")}</p>
        <p>{t("p4")}</p>
      </div>
    </div>
  );
}
