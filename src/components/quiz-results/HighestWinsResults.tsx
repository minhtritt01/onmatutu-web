"use client";

import { useTranslations } from "next-intl";
import type { CategoryScore } from "@/lib/quiz-engine";
import { ResultActions } from "@/components/quiz-results/ResultActions";

export function HighestWinsResults({
  namespace,
  scores,
  onRetake,
}: {
  namespace: string;
  scores: CategoryScore[];
  onRetake: () => void;
}) {
  const t = useTranslations(namespace);

  const [top, ...rest] = scores;
  const runnerUps = rest.filter((s) => top.percent - s.percent <= 10);
  const topResults = [top, ...runnerUps];
  const others = rest.filter((s) => !runnerUps.includes(s));

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">{t("results.heading")}</h2>
      <p className="mb-8 text-sm text-foreground/60">{t("results.resultDisclaimer")}</p>

      {topResults.map((score) => (
        <div key={score.category} className="mb-6 rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10 p-5">
          <h3 className="mb-2 text-lg font-semibold">{t(`categories.${score.category}.name`)}</h3>
          <p className="text-sm text-foreground/70">{t(`categories.${score.category}.blurb`)}</p>
        </div>
      ))}

      {others.length > 0 && (
        <div className="mt-8">
          {others.map((score) => (
            <div key={score.category} className="mb-4">
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-sm font-medium text-foreground/70">
                  {t(`categories.${score.category}.name`)}
                </span>
                <span className="text-xs text-foreground/50">{score.percent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-brand-gray/30">
                <div
                  className="h-full rounded-full bg-brand-navy transition-[width] duration-500 motion-reduce:transition-none"
                  style={{ width: `${score.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ResultActions namespace={namespace} onRetake={onRetake} />
    </div>
  );
}
