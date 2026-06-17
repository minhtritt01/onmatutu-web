import Image from "next/image";
import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tBlog = await getTranslations("blog");
  const posts = getAllPosts(locale).slice(0, 6);

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-brand-yellow bg-brand-navy/20">
          <Image
            src="/character/phoenix-peaceful.jpg"
            alt={t("heroAlt")}
            fill
            sizes="160px"
            className="object-cover"
            priority
          />
        </div>
        <h1 className="text-3xl font-semibold sm:text-4xl">{siteConfig.name}</h1>
        <p className="max-w-xl text-foreground/70">
          {(await getTranslations("site"))("description")}
        </p>
        <div className="flex gap-3">
          <Link
            href="/blog"
            className="rounded-full bg-brand-yellow px-5 py-2 text-sm font-medium text-foreground transition hover:opacity-90"
          >
            {t("readStories")}
          </Link>
          <a
            href={siteConfig.socials.tiktok}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-brand-gray px-5 py-2 text-sm font-medium transition hover:bg-brand-gray/20"
          >
            {t("followTiktok")}
          </a>
        </div>
      </section>

      {/* Latest posts */}
      <section className="py-8">
        <h2 className="mb-6 text-xl font-semibold">{t("latestStories")}</h2>
        {posts.length === 0 ? (
          <p className="text-foreground/60">{t("noPosts")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-2xl border border-brand-gray p-5 transition hover:border-brand-yellow hover:shadow-sm"
              >
                <span className="text-xs font-medium uppercase tracking-wide text-brand-navy">
                  {t("pillarLabel", { pillar: post.frontmatter.pillar })}
                </span>
                <h3 className="mt-2 text-lg font-medium">{post.frontmatter.title}</h3>
                <p className="mt-1 text-sm text-foreground/60">{post.frontmatter.description}</p>
                <p className="mt-2 text-xs text-foreground/40">{tBlog("readingTime", { n: post.readingTime })}</p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
