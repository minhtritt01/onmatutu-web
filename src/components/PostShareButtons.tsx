"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function PostShareButtons() {
  const t = useTranslations("share");
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  async function handleClick() {
    if (canShare) {
      try {
        await navigator.share({ title: document.title, url: window.location.href });
      } catch {
        // user cancelled or error — ignore
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="mt-4 flex items-center gap-2">
      <button
        onClick={handleClick}
        className="text-xs border border-brand-gray px-3 py-1.5 rounded-full hover:border-brand-yellow transition text-foreground/70"
      >
        {canShare ? t("button") : copied ? t("copied") : t("copy")}
      </button>
    </div>
  );
}
