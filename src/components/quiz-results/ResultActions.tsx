"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function ResultActions({ namespace, onRetake }: { namespace: string; onRetake: () => void }) {
  const t = useTranslations(namespace);
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  async function handleShare() {
    if (canShare) {
      try {
        await navigator.share({ title: document.title, url: window.location.href });
      } catch {
        // user cancelled — ignore
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // clipboard unavailable — ignore
      }
    }
  }

  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <button
        onClick={onRetake}
        className="cursor-pointer rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-semibold text-[#2b2b2b] transition-colors duration-200 hover:opacity-90"
      >
        {t("results.retake")}
      </button>
      <button
        onClick={handleShare}
        className="cursor-pointer rounded-full border border-brand-gray px-6 py-2.5 text-sm text-foreground/70 transition-colors duration-200 hover:border-brand-yellow"
      >
        {copied ? t("results.shareCopied") : t("results.shareCta")}
      </button>
    </div>
  );
}
