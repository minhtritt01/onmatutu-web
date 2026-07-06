import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { localePath } from "@/i18n/routing";
import { socialMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { QuizRunner } from "@/components/QuizRunner";
import { mbtiQuiz } from "@/lib/quizzes/mbti";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "mbti" });
  const url = `${siteConfig.url}${localePath(locale, "/quiz/mbti")}`;
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        vi: `${siteConfig.url}/quiz/mbti`,
        en: `${siteConfig.url}/en/quiz/mbti`,
      },
    },
    ...socialMetadata({ locale, url, title: t("title"), description: t("metaDescription") }),
  };
}

export default async function MbtiPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("mbti");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    description: t("metaDescription"),
    url: `${siteConfig.url}${localePath(locale, "/quiz/mbti")}`,
    applicationCategory: "LifestyleApplication",
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

      <QuizRunner definition={mbtiQuiz} />
    </div>
  );
}
