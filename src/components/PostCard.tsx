"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Post } from "@/lib/content";

const PILLAR_HEX: Record<string, string> = {
  A: "#f4c95d",
  B: "#a8c5d6",
  C: "#5dd4d4",
  D: "#f0a0c0",
};

type Props = { post: Post };

export function PostCard({ post }: Props) {
  const t = useTranslations("blog");
  const hex = PILLAR_HEX[post.frontmatter.pillar] ?? "#a8c5d6";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-l-4 border-brand-gray p-5 transition-all duration-200 hover:-translate-y-1 hover:border-brand-yellow hover:shadow-[0_4px_24px_rgba(244,201,93,0.15)]"
      style={{ borderLeftColor: hex }}
    >
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-foreground/50">
        <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ background: hex }} />
        {t("pillarLabel", { pillar: post.frontmatter.pillar })}
      </span>
      <h2 className="mt-2 text-lg font-medium leading-snug">{post.frontmatter.title}</h2>
      <p className="mt-1 line-clamp-2 text-sm text-foreground/60">{post.frontmatter.description}</p>
      <div className="mt-3 flex items-center gap-1 text-xs text-foreground/40">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {t("readingTime", { n: post.readingTime })}
      </div>
    </Link>
  );
}
