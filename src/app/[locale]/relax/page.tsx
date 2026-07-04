import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { localePath } from "@/i18n/routing";
import { socialMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "relaxHub" });
  const url = `${siteConfig.url}${localePath(locale, "/relax")}`;
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        vi: `${siteConfig.url}/relax`,
        en: `${siteConfig.url}/en/relax`,
      },
    },
    ...socialMetadata({ locale, url, title: t("title"), description: t("metaDescription") }),
  };
}

export default async function RelaxHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("relaxHub");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">{t("title")}</h1>
      <p className="mb-10 text-sm text-foreground/60">{t("intro")}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/relax/breathing"
          className="rounded-2xl border border-brand-gray p-6 transition hover:border-brand-yellow"
        >
          <h2 className="mb-1 text-lg font-semibold">{t("cards.breathing.title")}</h2>
          <p className="text-sm text-foreground/60">{t("cards.breathing.description")}</p>
        </Link>
        <Link
          href="/relax/quotes"
          className="rounded-2xl border border-brand-gray p-6 transition hover:border-brand-yellow"
        >
          <h2 className="mb-1 text-lg font-semibold">{t("cards.quotes.title")}</h2>
          <p className="text-sm text-foreground/60">{t("cards.quotes.description")}</p>
        </Link>
      </div>
    </div>
  );
}
