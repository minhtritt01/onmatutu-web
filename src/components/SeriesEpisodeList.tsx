import { Link } from "@/i18n/navigation";
import type { Post } from "@/lib/content";

type Props = {
  episodes: Post[];
  heading: string;
};

export function SeriesEpisodeList({ episodes, heading }: Props) {
  return (
    <section className="mt-10 border-t border-brand-gray pt-6">
      <h2 className="mb-4 text-lg font-semibold">{heading}</h2>
      <ol className="list-decimal space-y-2 pl-5">
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
  );
}
