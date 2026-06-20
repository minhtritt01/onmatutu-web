"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { siteConfig } from "@/lib/site-config";

type Props = {
  quote: string;
  title: string;
};

export function QuoteCard({ quote, title }: Props) {
  const t = useTranslations("quoteCard");
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const text = `"${quote}" — ${siteConfig.hashtag}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ text, url: window.location.href });
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
    }
  }

  return (
    <div className="my-8">
      <div
        className="relative overflow-hidden rounded-2xl p-8 text-center"
        style={{
          background: "#0f0f11",
          border: "1px solid rgba(244,201,93,0.25)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(244,201,93,0.10) 0%, transparent 70%)",
          }}
        />
        <p className="relative mb-4 text-xs font-semibold uppercase tracking-widest text-brand-yellow/70">
          {siteConfig.hashtag}
        </p>
        <blockquote className="relative text-base font-medium italic leading-relaxed text-[#f0ede8] sm:text-lg">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <p className="relative mt-4 text-xs text-[#f0ede8]/40">— {title}</p>
      </div>
      <div className="mt-3 flex flex-col items-center gap-1.5">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 rounded-full border border-brand-gray px-4 py-2 text-xs text-foreground/70 transition hover:border-brand-yellow hover:text-foreground"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          {copied ? t("copied") : t("shareQuote")}
        </button>
        <p className="text-xs text-foreground/30">{t("screenshotHint")}</p>
      </div>
    </div>
  );
}
