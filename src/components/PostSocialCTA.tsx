"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site-config";

type Props = {
  videoUrl?: string;
  locale: string;
};

export function PostSocialCTA({ videoUrl }: Props) {
  const t = useTranslations("postCTA");

  const tiktokHref = videoUrl ?? siteConfig.socials.tiktok;
  const youtubeHref = siteConfig.socials.youtube;

  return (
    <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl p-6">
      <p className="font-semibold text-lg">{t("heading")}</p>
      <p className="text-sm text-foreground/70 mt-1">{t("body")}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          href={tiktokHref}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-brand-yellow text-foreground font-medium px-5 py-2 rounded-full hover:opacity-90 transition text-sm"
        >
          {t("watchTikTok")}
        </a>
        <a
          href={youtubeHref}
          target="_blank"
          rel="noopener noreferrer"
          className="border border-brand-gray text-foreground/80 px-5 py-2 rounded-full hover:border-brand-yellow transition text-sm"
        >
          {t("followYouTube")}
        </a>
      </div>
    </div>
  );
}
