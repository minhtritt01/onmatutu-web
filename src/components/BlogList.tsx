"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { Post } from "@/lib/content";
import type { Pillar } from "@/lib/site-config";
import { PostCard } from "@/components/PostCard";

const PILLAR_HEX: Record<Pillar, string> = {
  A: "#f4c95d",
  B: "#a8c5d6",
  C: "#5dd4d4",
  D: "#f0a0c0",
};

type Props = {
  posts: Post[];
  allLabel: string;
  pillarLabels: Record<Pillar, string>;
};

export default function BlogList({ posts, allLabel, pillarLabels }: Props) {
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
      <div className="mb-8 flex flex-wrap gap-2">
        <Link
          href="/blog"
          className={`flex items-center rounded-full px-4 py-1.5 text-sm transition ${
            !isValidPillar
              ? "bg-brand-yellow text-foreground"
              : "border border-brand-gray text-foreground/70 hover:border-brand-yellow/60"
          }`}
        >
          {allLabel}
        </Link>
        {validPillars.map((pillar) => (
          <Link
            key={pillar}
            href={`/blog?pillar=${pillar}`}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition ${
              activePillar === pillar
                ? "bg-brand-yellow text-foreground"
                : "border border-brand-gray text-foreground/70 hover:border-brand-yellow/60"
            }`}
          >
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ background: PILLAR_HEX[pillar] }}
            />
            {pillarLabels[pillar]}
          </Link>
        ))}
      </div>

      {/* Post grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </>
  );
}
