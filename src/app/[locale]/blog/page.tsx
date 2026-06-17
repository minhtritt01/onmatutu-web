import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { localePath } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import BlogList from "@/components/BlogList";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    description: t("description", { siteName: siteConfig.name }),
    alternates: {
      canonical: `${siteConfig.url}${localePath(locale, "/blog")}`,
      languages: {
        vi: `${siteConfig.url}/blog`,
        en: `${siteConfig.url}/en/blog`,
      },
    },
  };
}

export default async function BlogIndexPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blog");
  const tPillars = await getTranslations("pillars");
  const posts = getAllPosts(locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold">{t("title")}</h1>
      {posts.length === 0 ? (
        <p className="text-foreground/60">{t("noPosts")}</p>
      ) : (
        <Suspense fallback={null}>
          <BlogList
            posts={posts}
            allLabel={t("filterAll")}
            pillarLabels={{
              A: tPillars("A"),
              B: tPillars("B"),
              C: tPillars("C"),
              D: tPillars("D"),
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
