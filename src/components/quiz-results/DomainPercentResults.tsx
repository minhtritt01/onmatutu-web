"use client";

import { useTranslations } from "next-intl";
import type { CategoryScore, QuizDefinition } from "@/lib/quiz-engine";
import { ResultActions } from "@/components/quiz-results/ResultActions";
import { IconBadge } from "@/components/result-icons/icon-system";
import { getResultIcon } from "@/components/result-icons";

const BAR_COLORS = ["bg-brand-yellow", "bg-brand-navy"];

function ScoreBar({
  score,
  definition,
  index,
}: {
  score: CategoryScore;
  definition: QuizDefinition;
  index: number;
}) {
  const t = useTranslations(definition.namespace);
  const isHigh = score.percent >= 50;
  const blurb = isHigh ? "highBlurb" : "lowBlurb";
  const Icon = getResultIcon(definition.id, `${score.category}_${isHigh ? "high" : "low"}`);

  return (
    <div className="mb-6 flex gap-4">
      <IconBadge tone={index % 2 === 0 ? "yellow" : "navy"}>
        <Icon />
      </IconBadge>
      <div className="flex-1">
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
    </div>
  );
}

export function DomainPercentResults({
  definition,
  scores,
  onRetake,
}: {
  definition: QuizDefinition;
  scores: CategoryScore[];
  onRetake: () => void;
}) {
  const t = useTranslations(definition.namespace);

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">{t("results.heading")}</h2>
      <p className="mb-8 text-sm text-foreground/60">{t("results.resultDisclaimer")}</p>

      {scores.map((score, i) => (
        <ScoreBar key={score.category} score={score} definition={definition} index={i} />
      ))}

      <ResultActions namespace={definition.namespace} onRetake={onRetake} />
    </div>
  );
}
