import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { localePath } from "@/i18n/routing";
import { socialMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllQuotes, type QuoteCategory } from "@/lib/content";
import { QuoteCard } from "@/components/QuoteCard";

const CATEGORIES: QuoteCategory[] = ["buon", "ap-luc", "co-don", "dong-luc-sang"];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quotesPage" });
  const url = `${siteConfig.url}${localePath(locale, "/relax/quotes")}`;
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        vi: `${siteConfig.url}/relax/quotes`,
        en: `${siteConfig.url}/en/relax/quotes`,
      },
    },
    ...socialMetadata({ locale, url, title: t("title"), description: t("metaDescription") }),
  };
}

export default async function QuotesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("quotesPage");
  const quotes = getAllQuotes(locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">{t("title")}</h1>
      <p className="mb-6 text-sm text-foreground/60">{t("intro")}</p>

      <nav className="mb-8 flex flex-wrap gap-2">
        <span className="rounded-full border border-brand-yellow bg-brand-yellow/10 px-4 py-1.5 text-sm text-foreground">
          {t("allCategory")}
        </span>
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/relax/quotes/${category}`}
            className="rounded-full border border-brand-gray px-4 py-1.5 text-sm text-foreground/70 transition hover:border-brand-yellow"
          >
            {t(`categories.${category}`)}
          </Link>
        ))}
      </nav>

      {quotes.length === 0 ? (
        <p className="text-sm text-foreground/50">{t("noQuotes")}</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {quotes.map((q) => (
            <QuoteCard key={q.slug} quote={q.frontmatter.quote} attribution={q.frontmatter.author} />
          ))}
        </div>
      )}
    </div>
  );
}
