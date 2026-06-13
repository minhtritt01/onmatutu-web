import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllSeriesSlugs,
  getSeriesBySlug,
  getPostsBySeries,
} from "@/lib/content";
import { MDXRemote } from "@/components/MDXRemote";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSeriesSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) return {};
  return {
    title: series.frontmatter.title,
    description: series.frontmatter.description,
  };
}

export default async function SeriesPage({ params }: Props) {
  const { slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) notFound();

  const episodes = getPostsBySeries(slug);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <span className="text-xs font-medium uppercase tracking-wide text-brand-navy">
        Mini-series · Pillar D
      </span>
      <h1 className="mt-2 text-3xl font-semibold">
        {series.frontmatter.title}
      </h1>
      <div className="prose prose-neutral mt-6 max-w-none">
        <MDXRemote source={series.content} />
      </div>

      {episodes.length > 0 && (
        <section className="mt-10 border-t border-brand-gray pt-6">
          <h2 className="mb-4 text-lg font-semibold">Các phần trong series</h2>
          <ol className="space-y-2 list-decimal pl-5">
            {episodes.map((ep) => (
              <li key={ep.slug}>
                <Link
                  href={`/blog/${ep.slug}`}
                  className="text-brand-navy hover:underline"
                >
                  {ep.frontmatter.title}
                </Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
