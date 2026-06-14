import { siteConfig } from "@/lib/site-config";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="mt-16 border-t border-brand-gray bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 text-sm text-foreground/60">
        <p className="mb-3">
          {t("copyright", {
            year: new Date().getFullYear(),
            siteName: siteConfig.name,
            hashtag: siteConfig.hashtag,
          })}
        </p>
        <div className="flex gap-4">
          <a href={siteConfig.socials.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
          <a href={siteConfig.socials.youtube} target="_blank" rel="noreferrer">
            YouTube
          </a>
          <a href={siteConfig.socials.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href={siteConfig.socials.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}
