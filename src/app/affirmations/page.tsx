import type { Metadata } from "next";
import { getPostsByPillar } from "@/lib/content";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Affirmation mỗi ngày",
  description: `Tổng hợp những lời nhắc nhẹ nhàng buổi sáng từ ${siteConfig.name}.`,
};

export default function AffirmationsPage() {
  const posts = getPostsByPillar("C");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">Affirmation mỗi ngày</h1>
      <p className="mb-8 text-foreground/60">
        Những lời nhắc nhẹ nhàng, không sáo rỗng — gắn với một tình huống cụ
        thể, để bạn bắt đầu ngày mới dễ chịu hơn.
      </p>

      {posts.length === 0 ? (
        <p className="text-foreground/60">
          Chưa có affirmation nào. Thêm bài viết Pillar C trong{" "}
          <code>content/blog</code>.
        </p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li
              key={post.slug}
              className="rounded-2xl border border-brand-gray p-4"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="font-medium hover:underline"
              >
                {post.frontmatter.title}
              </Link>
              <p className="mt-1 text-sm text-foreground/60">
                {post.frontmatter.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
