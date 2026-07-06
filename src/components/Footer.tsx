import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  TikTokIcon,
  YouTubeIcon,
  InstagramIcon,
  FacebookIcon,
} from "@/components/icons/SocialIcons";

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  const socialLinks = [
    { label: "TikTok", href: siteConfig.socials.tiktok, Icon: TikTokIcon },
    { label: "YouTube", href: siteConfig.socials.youtube, Icon: YouTubeIcon },
    {
      label: "Instagram",
      href: siteConfig.socials.instagram,
      Icon: InstagramIcon,
    },
    {
      label: "Facebook",
      href: siteConfig.socials.facebook,
      Icon: FacebookIcon,
    },
  ];

  const navLinks = [
    { label: tNav("blog"), href: "/blog" as const },
    { label: tNav("videos"), href: "/videos" as const },
    { label: tNav("relax"), href: "/relax" as const },
    { label: tNav("quiz"), href: "/quiz" as const },
    { label: tNav("affirmations"), href: "/affirmations" as const },
    { label: tNav("about"), href: "/about" as const },
    { label: tNav("share"), href: "/share-story" as const },
  ];

  return (
    <footer className="mt-16 border-t border-brand-gray bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          {/* Brand column */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border-2 border-brand-yellow">
                <Image
                  src="/character/phoenix-peaceful.jpg"
                  alt={siteConfig.name}
                  fill
                  sizes="48px"
                  className="object-cover object-top"
                />
              </div>
              <span className="font-semibold text-brand-yellow">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/60">
              {t("tagline")}
            </p>
            <p className="text-xs text-foreground/40">{siteConfig.hashtag}</p>
          </div>

          {/* Quick links */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground/40">
              {t("quickLinks")}
            </p>
            <nav className="flex flex-col gap-2">
              {navLinks.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-foreground/60 transition hover:text-brand-yellow"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social icons */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-foreground/40">
              {t("social")}
            </p>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gray text-foreground/60 transition hover:border-brand-yellow hover:bg-brand-yellow hover:text-foreground"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-brand-gray pt-6 text-xs text-foreground/40">
          {t("copyright", {
            year: new Date().getFullYear(),
            siteName: siteConfig.name,
            hashtag: siteConfig.hashtag,
          })}
        </div>
      </div>
    </footer>
  );
}
