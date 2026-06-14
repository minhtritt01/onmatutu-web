import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    description: t("description", { siteName: siteConfig.name }),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/blog`,
      languages: {
        vi: `${siteConfig.url}/vi/blog`,
        en: `${siteConfig.url}/en/blog`,
      },
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const posts = getAllPosts(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold">{t("title")}</h1>
      {posts.length === 0 ? (
        <p className="text-foreground/60">{t("noPosts")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
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
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
