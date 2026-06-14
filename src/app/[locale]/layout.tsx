import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { siteConfig } from "@/lib/site-config";
import { routing, type Locale } from "@/i18n/routing";
import { getTranslations, getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { Poppins, Geist_Mono } from "next/font/google";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  const altLang = locale === "vi" ? "en" : "vi";

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
      canonical: `${siteConfig.url}/${locale}`,
      languages: {
        vi: `${siteConfig.url}/vi`,
        en: `${siteConfig.url}/en`,
        "x-default": `${siteConfig.url}/vi`,
      },
    },
    openGraph: {
      type: "website",
      locale: ogLocale,
      alternateLocale: [altLocale],
      url: `${siteConfig.url}/${locale}`,
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
    <html
      lang={locale}
      className={`h-full antialiased ${poppins.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* Runs synchronously before paint — prevents dark-mode flash on reload */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(t===null&&d)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
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
      </body>
    </html>
  );
}
