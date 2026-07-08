import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { routing, localePath } from "@/i18n/routing";
import { socialMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAffirmationsByCategory, type AffirmationCategory } from "@/lib/content";
import { QuoteCard } from "@/components/QuoteCard";

const CATEGORIES: AffirmationCategory[] = ["buon", "ap-luc", "co-don", "dong-luc-sang"];

type Props = { params: Promise<{ locale: string; category: string }> };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CATEGORIES.map((category) => ({ locale, category })),
  );
}

function isAffirmationCategory(value: string): value is AffirmationCategory {
  return (CATEGORIES as string[]).includes(value);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isAffirmationCategory(category)) return {};

  const t = await getTranslations({ locale, namespace: "affirmations" });
  const label = t(`categories.${category}`);
  const title = `${label} — ${t("title")}`;
  const url = `${siteConfig.url}${localePath(locale, `/affirmations/${category}`)}`;
  const description = t("description", { siteName: siteConfig.name });
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        vi: `${siteConfig.url}/affirmations/${category}`,
        en: `${siteConfig.url}/en/affirmations/${category}`,
      },
    },
    ...socialMetadata({ locale, url, title, description }),
  };
}

export default async function AffirmationCategoryPage({ params }: Props) {
  const { locale, category } = await params;
  if (!isAffirmationCategory(category)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations("affirmations");
  const affirmations = getAffirmationsByCategory(category, locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">{t(`categories.${category}`)}</h1>
      <p className="mb-6 text-sm text-foreground/60">{t("intro")}</p>

      <nav className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/affirmations"
          className="rounded-full border border-brand-gray px-4 py-1.5 text-sm text-foreground/70 transition hover:border-brand-yellow"
        >
          {t("allCategory")}
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={`/affirmations/${c}`}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              c === category
                ? "border-brand-yellow bg-brand-yellow/10 text-foreground"
                : "border-brand-gray text-foreground/70 hover:border-brand-yellow"
            }`}
          >
            {t(`categories.${c}`)}
          </Link>
        ))}
      </nav>

      {affirmations.length === 0 ? (
        <p className="text-sm text-foreground/50">{t("noAffirmations")}</p>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2">
          {affirmations.map((a) => (
            <QuoteCard key={a.slug} quote={a.frontmatter.text} />
          ))}
        </div>
      )}
    </div>
  );
}
