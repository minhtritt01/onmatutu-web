"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { BigFiveDomain, DomainScore } from "@/lib/big-five-items";

const BAR_COLOR: Record<BigFiveDomain, string> = {
  openness: "bg-brand-yellow",
  conscientiousness: "bg-brand-navy",
  extraversion: "bg-brand-yellow",
  agreeableness: "bg-brand-navy",
  neuroticism: "bg-brand-yellow",
};

function ScoreBar({ score }: { score: DomainScore }) {
  const t = useTranslations("bigFive");
  const blurb = score.percent >= 50 ? "highBlurb" : "lowBlurb";

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-base font-semibold">{t(`domains.${score.domain}.name`)}</h3>
        <span className="text-sm text-foreground/60">{score.percent}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-brand-gray/30">
        <div
          className={`h-full rounded-full ${BAR_COLOR[score.domain]} transition-[width] duration-500 motion-reduce:transition-none`}
          style={{ width: `${score.percent}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-foreground/70">{t(`domains.${score.domain}.${blurb}`)}</p>
    </div>
  );
}

export function BigFiveResults({
  scores,
  onRetake,
}: {
  scores: DomainScore[];
  onRetake: () => void;
}) {
  const t = useTranslations("bigFive");
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
    <div>
      <h2 className="mb-1 text-xl font-semibold">{t("results.heading")}</h2>
      <p className="mb-8 text-sm text-foreground/60">{t("results.resultDisclaimer")}</p>

      {scores.map((score) => (
        <ScoreBar key={score.domain} score={score} />
      ))}

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
    </div>
  );
}
