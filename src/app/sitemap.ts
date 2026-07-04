import type { MetadataRoute } from "next";
import { getAllPosts, getAllPostSlugs, getAllSeriesSlugs } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { routing, localePath } from "@/i18n/routing";

const locales = routing.locales;

function localeUrl(locale: string, path: string = "") {
  return `${siteConfig.url}${localePath(locale, path)}`;
}

function altLanguages(path: string) {
  return Object.fromEntries(locales.map((l) => [l, localeUrl(l, path)]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/blog",
    "/affirmations",
    "/about",
    "/relax",
    "/relax/breathing",
    "/relax/quotes",
  ];

  const staticRoutes: MetadataRoute.Sitemap = staticPaths.flatMap((p) =>
    locales.map((locale) => ({
      url: localeUrl(locale, p),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1.0 : p === "/blog" ? 0.9 : p.startsWith("/relax") ? 0.8 : 0.7,
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
        url: localeUrl(locale, `/blog/${slug}`),
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
      url: localeUrl(locale, `/series/${slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      alternates: { languages: altLanguages(`/series/${slug}`) },
    }))
  );

  const pillars = ["A", "B", "C", "D"] as const;

  const pillarRoutes: MetadataRoute.Sitemap = pillars.flatMap((pillar) =>
    locales.map((locale) => ({
      url: localeUrl(locale, `/pillar/${pillar}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      alternates: { languages: altLanguages(`/pillar/${pillar}`) },
    }))
  );

  const quoteCategories = ["buon", "ap-luc", "co-don", "dong-luc-sang"];

  const quoteCategoryRoutes: MetadataRoute.Sitemap = quoteCategories.flatMap((category) =>
    locales.map((locale) => ({
      url: localeUrl(locale, `/relax/quotes/${category}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: altLanguages(`/relax/quotes/${category}`) },
    }))
  );

  return [
    ...staticRoutes,
    ...blogRoutes,
    ...seriesRoutes,
    ...pillarRoutes,
    ...quoteCategoryRoutes,
  ];
}
