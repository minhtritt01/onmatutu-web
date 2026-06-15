import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSeriesSlugs, getSeriesBySlug, getPostsBySeries } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { routing, localePath } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MDXRemote } from "@/components/MDXRemote";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllSeriesSlugs(locale).map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const series = getSeriesBySlug(slug, locale);
  if (!series) return {};
  return {
    title: series.frontmatter.title,
    description: series.frontmatter.description,
    alternates: {
      canonical: `${siteConfig.url}${localePath(locale, `/series/${slug}`)}`,
      languages: {
        vi: `${siteConfig.url}/series/${slug}`,
        en: `${siteConfig.url}/en/series/${slug}`,
      },
    },
  };
}

export default async function SeriesPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const series = getSeriesBySlug(slug, locale);
  if (!series) notFound();

  const episodes = getPostsBySeries(slug, locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <span className="text-xs font-medium uppercase tracking-wide text-brand-navy">
        {t("seriesLabel")}
      </span>
      <h1 className="mt-2 text-3xl font-semibold">{series.frontmatter.title}</h1>
      <div className="prose prose-neutral mt-6 max-w-none">
        <MDXRemote source={series.content} />
      </div>

      {episodes.length > 0 && (
        <section className="mt-10 border-t border-brand-gray pt-6">
          <h2 className="mb-4 text-lg font-semibold">{t("seriesEpisodes")}</h2>
          <ol className="list-decimal space-y-2 pl-5">
            {episodes.map((ep) => (
              <li key={ep.slug}>
                <Link
                  href={`/blog/${ep.slug}`}
                  className="text-brand-navy hover:underline"
                >
                  {ep.frontmatter.title}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
