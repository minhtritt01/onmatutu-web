import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { localePath } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ShareStoryForm } from "@/components/ShareStoryForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "shareStory" });
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: `${siteConfig.url}${localePath(locale, "/share-story")}`,
      languages: {
        vi: `${siteConfig.url}/share-story`,
        en: `${siteConfig.url}/en/share-story`,
      },
    },
  };
}

export default async function ShareStoryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("shareStory");

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">{t("title")}</h1>
      <p className="mb-8 text-sm text-foreground/50">{t("subtitle")}</p>

      {/* Anonymity notice */}
      <div className="mb-6 rounded-xl border border-brand-yellow/40 bg-brand-yellow/10 px-5 py-4">
        <p className="font-medium text-foreground">{t("notice")}</p>
        <p className="mt-1 text-sm text-foreground/60">{t("noticeDetail")}</p>
      </div>

      {/* Story guide */}
      <div className="mb-8 space-y-3">
        <p className="text-sm text-foreground/70">{t("guideHeading")}</p>
        <ul className="space-y-2">
          {(t.raw("guideItems") as string[]).map((item, i) => (
            <li key={i} className="flex gap-2 text-sm text-foreground/80">
              <span className="mt-0.5 shrink-0 text-brand-yellow">✦</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="text-sm text-foreground/50 italic">{t("guideOptional")}</p>
      </div>

      <ShareStoryForm
        t={{
          placeholder: t("placeholder"),
          submit: t("submit"),
          submitting: t("submitting"),
          successTitle: t("successTitle"),
          successMessage: t("successMessage"),
          errorMessage: t("errorMessage"),
          minLength: t("minLength"),
          footer: t("footer"),
        }}
      />
    </div>
  );
}
