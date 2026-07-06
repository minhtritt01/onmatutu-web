"use client";

import { useTranslations } from "next-intl";
import type { SeveritySumResult } from "@/lib/quiz-engine";

export function SeveritySumResults({
  namespace,
  result,
  onRetake,
}: {
  namespace: string;
  result: SeveritySumResult;
  onRetake: () => void;
}) {
  const t = useTranslations(namespace);

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">{t("results.heading")}</h2>
      <p className="mb-6 text-sm text-foreground/60">{t("results.resultDisclaimer")}</p>

      <div className="mb-6 rounded-2xl border border-brand-gray p-6">
        <p className="mb-1 text-sm text-foreground/60">{result.total}</p>
        <h3 className="mb-2 text-lg font-semibold">{t(`bands.${result.band}.label`)}</h3>
        <p className="text-sm text-foreground/70">{t(`bands.${result.band}.blurb`)}</p>
      </div>

      <div className="mb-8 rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10 p-5">
        <h3 className="mb-2 text-base font-semibold">{t("results.supportHeading")}</h3>
        <p className="text-sm text-foreground/70">{t("results.supportBody")}</p>
      </div>

      <button
        onClick={onRetake}
        className="cursor-pointer rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-semibold text-[#2b2b2b] transition-colors duration-200 hover:opacity-90"
      >
        {t("results.retake")}
      </button>
    </div>
  );
}
