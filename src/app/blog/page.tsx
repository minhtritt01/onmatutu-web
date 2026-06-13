import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Câu chuyện",
  description: `Tất cả câu chuyện và bài học từ ${siteConfig.name}.`,
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-2xl font-semibold">Câu chuyện</h1>
      {posts.length === 0 ? (
        <p className="text-foreground/60">Chưa có bài viết nào.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="rounded-2xl border border-brand-gray p-5 transition hover:border-brand-yellow hover:shadow-sm"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-brand-navy">
                Pillar {post.frontmatter.pillar}
              </span>
              <h2 className="mt-2 text-lg font-medium">
                {post.frontmatter.title}
              </h2>
              <p className="mt-1 text-sm text-foreground/60">
                {post.frontmatter.description}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
