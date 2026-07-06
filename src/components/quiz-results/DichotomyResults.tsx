"use client";

import { useTranslations } from "next-intl";
import type { DichotomyResult } from "@/lib/quiz-engine";
import { ResultActions } from "@/components/quiz-results/ResultActions";

export function DichotomyResults({
  namespace,
  result,
  onRetake,
}: {
  namespace: string;
  result: DichotomyResult;
  onRetake: () => void;
}) {
  const t = useTranslations(namespace);

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">{t("results.heading")}</h2>
      <p className="mb-6 text-sm text-foreground/60">{t("results.resultDisclaimer")}</p>

      <div className="mb-6 rounded-2xl border border-brand-yellow/40 bg-brand-yellow/10 p-6 text-center">
        <p className="mb-1 text-4xl font-bold tracking-wide text-brand-navy">{result.code}</p>
        <h3 className="mb-2 text-lg font-semibold">{t(`types.${result.code}.name`)}</h3>
        <p className="text-sm text-foreground/70">{t(`types.${result.code}.blurb`)}</p>
      </div>

      <div className="mt-8">
        {result.pairs.map((pair) => (
          <div key={pair.poles.join("-")} className="mb-5">
            <div className="mb-1 flex items-center justify-between text-sm text-foreground/70">
              <span>
                {t(`poles.${pair.poles[0]}.label`)} · {pair.percent[0]}%
              </span>
              <span>
                {pair.percent[1]}% · {t(`poles.${pair.poles[1]}.label`)}
              </span>
            </div>
            <div className="flex h-2 w-full overflow-hidden rounded-full bg-brand-gray/30">
              <div
                className="h-full bg-brand-yellow transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${pair.percent[0]}%` }}
              />
              <div
                className="h-full bg-brand-navy transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${pair.percent[1]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <ResultActions namespace={namespace} onRetake={onRetake} />
    </div>
  );
}
