"use client";

import { useTranslations } from "next-intl";
import type { CategoryScore } from "@/lib/quiz-engine";
import { ResultActions } from "@/components/quiz-results/ResultActions";

const BAR_COLORS = ["bg-brand-yellow", "bg-brand-navy"];

function ScoreBar({ score, namespace, index }: { score: CategoryScore; namespace: string; index: number }) {
  const t = useTranslations(namespace);
  const blurb = score.percent >= 50 ? "highBlurb" : "lowBlurb";

  return (
    <div className="mb-6">
      <div className="mb-2 flex items-baseline justify-between">
        <h3 className="text-base font-semibold">{t(`domains.${score.category}.name`)}</h3>
        <span className="text-sm text-foreground/60">{score.percent}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-brand-gray/30">
        <div
          className={`h-full rounded-full ${BAR_COLORS[index % 2]} transition-[width] duration-500 motion-reduce:transition-none`}
          style={{ width: `${score.percent}%` }}
        />
      </div>
      <p className="mt-2 text-sm text-foreground/70">{t(`domains.${score.category}.${blurb}`)}</p>
    </div>
  );
}

export function DomainPercentResults({
  namespace,
  scores,
  onRetake,
}: {
  namespace: string;
  scores: CategoryScore[];
  onRetake: () => void;
}) {
  const t = useTranslations(namespace);

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">{t("results.heading")}</h2>
      <p className="mb-8 text-sm text-foreground/60">{t("results.resultDisclaimer")}</p>

      {scores.map((score, i) => (
        <ScoreBar key={score.category} score={score} namespace={namespace} index={i} />
      ))}

      <ResultActions namespace={namespace} onRetake={onRetake} />
    </div>
  );
}
