import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MDXRemote } from "@/components/MDXRemote";
import {
  getAllPostSlugs,
  getPostBySlug,
  getPostsByPillar,
} from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import Link from "next/link";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${siteConfig.url}/blog/${slug}`;

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      publishedTime: post.frontmatter.date,
      images: post.frontmatter.coverImage
        ? [{ url: post.frontmatter.coverImage }]
        : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getPostsByPillar(post.frontmatter.pillar)
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
    ...(post.frontmatter.videoUrl
      ? {
          video: {
            "@type": "VideoObject",
            name: post.frontmatter.title,
            description: post.frontmatter.description,
            uploadDate: post.frontmatter.date,
            embedUrl: post.frontmatter.videoUrl,
          },
        }
      : {}),
  };

  return (
    <article className="mx-auto max-w-2xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <span className="text-xs font-medium uppercase tracking-wide text-brand-navy">
        Pillar {post.frontmatter.pillar} · {post.frontmatter.episodeId}
      </span>
      <h1 className="mt-2 text-3xl font-semibold">{post.frontmatter.title}</h1>
      <p className="mt-2 text-sm text-foreground/60">
        {new Date(post.frontmatter.date).toLocaleDateString("vi-VN")}
      </p>

      {post.frontmatter.videoUrl && (
        <div className="mt-6 aspect-[9/16] max-w-sm overflow-hidden rounded-2xl border border-brand-gray">
          <iframe
            src={post.frontmatter.videoUrl}
            className="h-full w-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
            title={post.frontmatter.title}
          />
        </div>
      )}

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <MDXRemote source={post.content} />
      </div>

      {related.length > 0 && (
        <section className="mt-12 border-t border-brand-gray pt-6">
          <h2 className="mb-4 text-lg font-semibold">
            Câu chuyện cùng pillar
          </h2>
          <ul className="space-y-2">
            {related.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/blog/${p.slug}`}
                  className="text-brand-navy underline-offset-2 hover:underline"
                >
                  {p.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
