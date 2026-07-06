"use client";

import { useTranslations } from "next-intl";
import type { QuizDefinition } from "@/lib/quiz-engine";
import { useQuizRunner } from "@/lib/use-quiz-runner";
import { DomainPercentResults } from "@/components/quiz-results/DomainPercentResults";
import { HighestWinsResults } from "@/components/quiz-results/HighestWinsResults";
import { DichotomyResults } from "@/components/quiz-results/DichotomyResults";
import { SeveritySumResults } from "@/components/quiz-results/SeveritySumResults";
import { CrisisResourceBanner } from "@/components/quiz-results/CrisisResourceBanner";

function likertValues(definition: QuizDefinition): number[] {
  const { min, max } = definition.answerScale ?? { min: 1, max: 5 };
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

export function QuizRunner({ definition }: { definition: QuizDefinition }) {
  const t = useTranslations(definition.namespace);
  const { view, index, answers, result, start, answer, back, retake } = useQuizRunner(definition);

  if (view === "results" && result) {
    if (result.mode === "domain-percent") {
      return (
        <DomainPercentResults definition={definition} scores={result.scores} onRetake={retake} />
      );
    }
    if (result.mode === "highest-wins") {
      return (
        <HighestWinsResults definition={definition} scores={result.scores} onRetake={retake} />
      );
    }
    if (result.mode === "dichotomy") {
      return (
        <DichotomyResults definition={definition} result={result.result} onRetake={retake} />
      );
    }
    if (result.result.crisis) {
      return (
        <CrisisResourceBanner
          namespace={definition.namespace}
          result={result.result}
          onRetake={retake}
        />
      );
    }
    return (
      <SeveritySumResults namespace={definition.namespace} result={result.result} onRetake={retake} />
    );
  }

  if (view === "intro") {
    return (
      <button
        onClick={start}
        className="cursor-pointer rounded-full bg-brand-yellow px-8 py-3 text-sm font-semibold text-[#2b2b2b] transition-colors duration-200 hover:opacity-90"
      >
        {t("intro.startCta")}
      </button>
    );
  }

  const item = definition.items[index];
  const current = index + 1;
  const total = definition.items.length;
  const percent = Math.round((index / total) * 100);
  const selected = answers[item.id];

  return (
    <div>
      <p className="mb-2 text-sm text-foreground/60">{t("progressLabel", { current, total })}</p>
      <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-brand-gray/30">
        <div
          className="h-full rounded-full bg-brand-yellow transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>

      <h2 className="mb-8 text-xl font-semibold">{t(`items.item${item.id}`)}</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {likertValues(definition).map((value) => (
          <button
            key={value}
            onClick={() => answer(value)}
            aria-pressed={selected === value}
            className={`min-h-11 cursor-pointer rounded-full border-2 px-5 py-2.5 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow ${
              selected === value
                ? "border-brand-yellow bg-brand-yellow/10 text-foreground"
                : "border-brand-gray text-foreground/70 hover:border-brand-yellow"
            }`}
          >
            {t(`likert.${value}`)}
          </button>
        ))}
      </div>

      {index > 0 && (
        <button
          onClick={back}
          className="mt-8 cursor-pointer text-sm text-foreground/60 underline-offset-2 hover:underline"
        >
          {t("backButton")}
        </button>
      )}
    </div>
  );
}
