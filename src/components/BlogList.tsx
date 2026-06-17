"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Post } from "@/lib/content";
import type { Pillar } from "@/lib/site-config";

type Props = {
  posts: Post[];
  allLabel: string;
  pillarLabels: Record<Pillar, string>;
};

export default function BlogList({ posts, allLabel, pillarLabels }: Props) {
  const t = useTranslations("blog");
  const searchParams = useSearchParams();
  const activePillar = searchParams.get("pillar");

  const validPillars: Pillar[] = ["A", "B", "C", "D"];
  const isValidPillar = activePillar && (validPillars as string[]).includes(activePillar);
  const filteredPosts = isValidPillar
    ? posts.filter((p) => p.frontmatter.pillar === activePillar)
    : posts;

  return (
    <>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/blog"
          className={`px-4 py-1.5 text-sm transition rounded-full ${
            !isValidPillar
              ? "bg-brand-yellow text-foreground"
              : "border border-brand-gray text-foreground/70"
          }`}
        >
          {allLabel}
        </Link>
        {validPillars.map((pillar) => (
          <Link
            key={pillar}
            href={`/blog?pillar=${pillar}`}
            className={`px-4 py-1.5 text-sm transition rounded-full ${
              activePillar === pillar
                ? "bg-brand-yellow text-foreground"
                : "border border-brand-gray text-foreground/70"
            }`}
          >
            {pillar} · {pillarLabels[pillar]}
          </Link>
        ))}
      </div>

      {/* Post grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {filteredPosts.map((post) => (
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
    </>
  );
}
