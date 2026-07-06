import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { localePath } from "@/i18n/routing";
import { socialMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ClinicalQuizPage } from "@/components/ClinicalQuizPage";
import { gad7Quiz } from "@/lib/quizzes/gad-7";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gad7" });
  const url = `${siteConfig.url}${localePath(locale, "/quiz/gad-7")}`;
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        vi: `${siteConfig.url}/quiz/gad-7`,
        en: `${siteConfig.url}/en/quiz/gad-7`,
      },
    },
    ...socialMetadata({ locale, url, title: t("title"), description: t("metaDescription") }),
  };
}

export default async function Gad7Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("gad7");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    description: t("metaDescription"),
    url: `${siteConfig.url}${localePath(locale, "/quiz/gad-7")}`,
    applicationCategory: "HealthApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <h1 className="mb-2 text-2xl font-semibold">{t("intro.heading")}</h1>
      <p className="mb-4 text-sm text-foreground/70">{t("intro.body")}</p>
      <p className="mb-10 text-xs text-foreground/50">{t("intro.disclaimer")}</p>

      <ClinicalQuizPage definition={gad7Quiz} />
    </div>
  );
}
