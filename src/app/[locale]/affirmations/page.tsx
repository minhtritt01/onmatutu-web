import type { Metadata } from "next";
import { getPostsByPillar } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "affirmations" });
  return {
    title: t("title"),
    description: t("description", { siteName: siteConfig.name }),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/affirmations`,
      languages: {
        vi: `${siteConfig.url}/vi/affirmations`,
        en: `${siteConfig.url}/en/affirmations`,
      },
    },
  };
}

export default async function AffirmationsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("affirmations");
  const posts = getPostsByPillar("C", locale);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">{t("title")}</h1>
      <p className="mb-8 text-foreground/60">{t("intro")}</p>

      {posts.length === 0 ? (
        <p className="text-foreground/60">{t("noPosts")}</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug} className="rounded-2xl border border-brand-gray p-4">
              <Link href={`/blog/${post.slug}`} className="font-medium hover:underline">
                {post.frontmatter.title}
              </Link>
              <p className="mt-1 text-sm text-foreground/60">{post.frontmatter.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
