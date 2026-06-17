import type { Metadata } from "next";
import { getPostsByPillar } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import type { Pillar } from "@/lib/site-config";
import { routing, localePath } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const PILLARS: Pillar[] = ["A", "B", "C", "D"];

type Props = {
  params: Promise<{ locale: string; pillar: string }>;
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    PILLARS.map((pillar) => ({ locale, pillar }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, pillar } = await params;
  const tPillars = await getTranslations({ locale, namespace: "pillars" });
  const pillarName = tPillars(pillar as Pillar);

  return {
    title: pillarName,
    description: pillarName,
    alternates: {
      canonical: `${siteConfig.url}${localePath(locale, `/pillar/${pillar}`)}`,
      languages: {
        vi: `${siteConfig.url}/pillar/${pillar}`,
        en: `${siteConfig.url}/en/pillar/${pillar}`,
      },
    },
  };
}

export default async function PillarPage({ params }: Props) {
  const { locale, pillar } = await params;
  setRequestLocale(locale);

  const tPillars = await getTranslations("pillars");
  const t = await getTranslations("blog");

  const pillarName = tPillars(pillar as Pillar);
  const posts = getPostsByPillar(pillar as Pillar, locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <span className="text-xs font-medium uppercase tracking-wide text-brand-navy">
        Pillar {pillar}
      </span>
      <h1 className="mt-2 text-2xl font-semibold">{pillarName}</h1>
      <p className="mt-2 text-foreground/70">{pillarName}</p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="rounded-2xl border border-brand-gray p-5 transition hover:border-brand-yellow hover:shadow-sm"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-brand-navy">
              {t("pillarLabel", { pillar: post.frontmatter.pillar })}
            </span>
            <h2 className="mt-2 text-lg font-medium">{post.frontmatter.title}</h2>
            <p className="mt-1 text-sm text-foreground/60">{post.frontmatter.description}</p>
            <p className="mt-2 text-xs text-foreground/40">{t("readingTime", { n: post.readingTime })}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
