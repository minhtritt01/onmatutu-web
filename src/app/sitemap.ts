import type { MetadataRoute } from "next";
import { getAllPosts, getAllSeries, getAllPostSlugs, getAllSeriesSlugs } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { routing } from "@/i18n/routing";

const locales = routing.locales;

function altLanguages(path: string) {
  return Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}${path}`]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/blog", "/affirmations", "/about"];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.flatMap((p) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}${p}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1.0 : p === "/blog" ? 0.9 : 0.7,
      alternates: { languages: altLanguages(p) },
    }))
  );

  const allSlugs = [
    ...new Set([...getAllPostSlugs("vi"), ...getAllPostSlugs("en")]),
  ];

  const blogRoutes: MetadataRoute.Sitemap = allSlugs.flatMap((slug) =>
    locales.map((locale) => {
      const post =
        getAllPosts(locale).find((p) => p.slug === slug) ??
        getAllPosts("vi").find((p) => p.slug === slug);
      return {
        url: `${siteConfig.url}/${locale}/blog/${slug}`,
        lastModified: post ? new Date(post.frontmatter.date) : new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: { languages: altLanguages(`/blog/${slug}`) },
      };
    })
  );

  const allSeriesSlugs = [
    ...new Set([...getAllSeriesSlugs("vi"), ...getAllSeriesSlugs("en")]),
  ];

  const seriesRoutes: MetadataRoute.Sitemap = allSeriesSlugs.flatMap((slug) =>
    locales.map((locale) => ({
      url: `${siteConfig.url}/${locale}/series/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: altLanguages(`/series/${slug}`) },
    }))
  );

  return [...staticRoutes, ...blogRoutes, ...seriesRoutes];
}
