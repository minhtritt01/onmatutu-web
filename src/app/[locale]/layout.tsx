import type { Metadata } from "next";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HtmlLang } from "@/components/HtmlLang";
import { SocialSidebar } from "@/components/SocialSidebar";
import { MobileSocialStrip } from "@/components/MobileSocialStrip";
import { siteConfig } from "@/lib/site-config";
import { routing, localePath, type Locale } from "@/i18n/routing";
import { getTranslations, getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID!;

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  const ogLocale = locale === "vi" ? "vi_VN" : "en_US";
  const altLocale = locale === "vi" ? "en_US" : "vi_VN";

  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: `${siteConfig.name} | ${t("tagline")}`,
      template: `%s | ${siteConfig.name}`,
    },
    description: t("description"),
    keywords: tMeta.raw("keywords") as string[],
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: {
      canonical: `${siteConfig.url}${localePath(locale)}`,
      languages: {
        vi: siteConfig.url,
        en: `${siteConfig.url}/en`,
        "x-default": siteConfig.url,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: [altLocale],
      url: `${siteConfig.url}${localePath(locale)}`,
      siteName: siteConfig.name,
      title: `${siteConfig.name} | ${t("tagline")}`,
      description: t("description"),
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteConfig.name} | ${t("tagline")}`,
      description: t("description"),
      images: [siteConfig.ogImage],
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale as Locale);

  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    sameAs: Object.values(siteConfig.socials),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <NextIntlClientProvider messages={messages}>
        <HtmlLang />
        <Header />
        <SocialSidebar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileSocialStrip />
      </NextIntlClientProvider>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `}</Script>
    </>
  );
}
