import type { MetadataRoute } from "next";
import { getAllPostSlugs, getAllSeriesSlugs } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/blog", "/about", "/affirmations"].map(
    (route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
    })
  );

  const blogRoutes = getAllPostSlugs().map((slug) => ({
    url: `${siteConfig.url}/blog/${slug}`,
    lastModified: new Date(),
  }));

  const seriesRoutes = getAllSeriesSlugs().map((slug) => ({
    url: `${siteConfig.url}/series/${slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...blogRoutes, ...seriesRoutes];
}
