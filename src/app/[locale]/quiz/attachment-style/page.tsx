import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { localePath } from "@/i18n/routing";
import { socialMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { QuizRunner } from "@/components/QuizRunner";
import { attachmentStyleQuiz } from "@/lib/quizzes/attachment-style";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "attachmentStyle" });
  const url = `${siteConfig.url}${localePath(locale, "/quiz/attachment-style")}`;
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        vi: `${siteConfig.url}/quiz/attachment-style`,
        en: `${siteConfig.url}/en/quiz/attachment-style`,
      },
    },
    ...socialMetadata({ locale, url, title: t("title"), description: t("metaDescription") }),
  };
}

export default async function AttachmentStylePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("attachmentStyle");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    description: t("metaDescription"),
    url: `${siteConfig.url}${localePath(locale, "/quiz/attachment-style")}`,
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

      <QuizRunner definition={attachmentStyleQuiz} />
    </div>
  );
}
