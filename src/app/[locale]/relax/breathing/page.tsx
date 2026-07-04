import { Suspense } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { localePath } from "@/i18n/routing";
import { socialMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BreathingTool } from "@/components/BreathingTool";
import { BreathingBackground } from "@/components/BreathingBackground";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "breathingTool" });
  const url = `${siteConfig.url}${localePath(locale, "/relax/breathing")}`;
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        vi: `${siteConfig.url}/relax/breathing`,
        en: `${siteConfig.url}/en/relax/breathing`,
      },
    },
    ...socialMetadata({ locale, url, title: t("title"), description: t("metaDescription") }),
  };
}

export default async function BreathingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("breathingTool");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("title"),
    description: t("metaDescription"),
    url: `${siteConfig.url}${localePath(locale, "/relax/breathing")}`,
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

      <h1 className="mb-2 text-2xl font-semibold">{t("title")}</h1>
      <p className="mb-8 text-sm text-foreground/60">{t("intro")}</p>

      <BreathingBackground>
        <Suspense fallback={null}>
          <BreathingTool />
        </Suspense>
      </BreathingBackground>

      <div className="mt-10 rounded-xl border border-brand-yellow/40 bg-brand-yellow/10 px-5 py-4">
        <p className="text-sm text-foreground/70">{t("disclaimer")}</p>
        <a
          href="https://www.vinmec.com/vie/bai-viet/cac-bai-tap-tho-giup-giam-cang-thang-lo-au-vi"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-sm text-brand-navy underline-offset-2 hover:underline"
        >
          {t("disclaimerLinkLabel")}
        </a>
      </div>
    </div>
  );
}
