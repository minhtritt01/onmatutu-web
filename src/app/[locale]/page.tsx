import Image from "next/image";
import { getAllPosts } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostCard } from "@/components/PostCard";
import { StatsStrip } from "@/components/StatsStrip";
import {
  TikTokIcon,
  YouTubeIcon,
  FacebookIcon,
} from "@/components/icons/SocialIcons";
import Link from "next/link";

type Props = { params: Promise<{ locale: string }> };

// Follow CTAs, mapped from siteConfig.socials with per-platform hover accents.
const FOLLOW_LINKS = [
  {
    href: siteConfig.socials.tiktok,
    label: "TikTok",
    Icon: TikTokIcon,
    hover: "hover:border-foreground/60",
  },
  {
    href: siteConfig.socials.youtube,
    label: "YouTube",
    Icon: YouTubeIcon,
    hover: "hover:border-[#FF0000] hover:text-[#FF0000]",
  },
  {
    href: siteConfig.socials.facebook,
    label: "Facebook",
    Icon: FacebookIcon,
    hover: "hover:border-[#1877F2] hover:text-[#1877F2]",
  },
] as const;

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tSite = await getTranslations("site");
  const posts = getAllPosts(locale).slice(0, 6);

  return (
    <div className="mx-auto max-w-4xl px-4">
      {/* Hero */}
      <section className="hero-glow relative flex flex-col items-center gap-6 pb-12 pt-16 text-center">
        {/* Character image — larger square */}
        <div className="relative h-60 w-60 overflow-hidden rounded-3xl border-4 border-brand-yellow bg-brand-navy/20 shadow-[0_0_48px_rgba(244,201,93,0.18)] sm:h-72 sm:w-72 animate-fade-in">
          <Image
            src="/character/phoenix-peaceful.jpg"
            alt={t("heroAlt")}
            fill
            sizes="(max-width: 640px) 240px, 288px"
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Site name + hashtag */}
        <div className="animate-fade-in-up" style={{ animationDelay: "120ms" }}>
          <h1 className="text-3xl font-semibold sm:text-4xl">
            {siteConfig.name}
          </h1>
          <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-yellow/80">
            {siteConfig.hashtag}
          </p>
        </div>

        {/* Description */}
        <p
          className="max-w-lg text-foreground/70 animate-fade-in-up"
          style={{ animationDelay: "220ms" }}
        >
          {tSite("description")}
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-wrap justify-center gap-3 animate-fade-in-up"
          style={{ animationDelay: "320ms" }}
        >
          <Link
            href="/blog"
            className="rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-medium text-foreground transition hover:opacity-90"
          >
            {t("readStories")}
          </Link>
          {FOLLOW_LINKS.map(({ href, label, Icon, hover }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${t("follow")} ${label}`}
              className={`flex items-center gap-2 rounded-full border border-brand-gray px-5 py-2.5 text-sm font-medium transition-colors duration-200 ${hover}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* Social-proof stats */}
      <section
        className="animate-fade-in-up py-4"
        style={{ animationDelay: "420ms" }}
      >
        <h2 className="sr-only">{t("statsHeading")}</h2>
        <StatsStrip stats={siteConfig.stats} />
      </section>

      {/* Latest posts */}
      <section className="py-8">
        <h2 className="mb-6 text-xl font-semibold">{t("latestStories")}</h2>
        {posts.length === 0 ? (
          <p className="text-foreground/60">{t("noPosts")}</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
