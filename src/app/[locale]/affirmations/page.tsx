import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { localePath } from "@/i18n/routing";
import { socialMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getAllAffirmations, type AffirmationCategory } from "@/lib/content";
import { QuoteCard } from "@/components/QuoteCard";

const CATEGORIES: AffirmationCategory[] = ["buon", "ap-luc", "co-don", "dong-luc-sang"];

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "affirmations" });
  const url = `${siteConfig.url}${localePath(locale, "/affirmations")}`;
  const description = t("description", { siteName: siteConfig.name });
  return {
    title: t("title"),
    description,
    alternates: {
      canonical: url,
      languages: {
        vi: `${siteConfig.url}/affirmations`,
        en: `${siteConfig.url}/en/affirmations`,
      },
    },
    ...socialMetadata({ locale, url, title: t("title"), description }),
  };
}

export default async function AffirmationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("affirmations");
  const affirmations = getAllAffirmations(locale);

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
            href={`/affirmations/${category}`}
            className="rounded-full border border-brand-gray px-4 py-1.5 text-sm text-foreground/70 transition hover:border-brand-yellow"
          >
            {t(`categories.${category}`)}
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
