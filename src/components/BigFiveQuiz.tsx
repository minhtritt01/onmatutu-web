"use client";

import { useTranslations } from "next-intl";
import { BIG_FIVE_ITEMS } from "@/lib/big-five-items";
import { useBigFiveQuiz } from "@/lib/use-big-five-quiz";
import { BigFiveResults } from "@/components/BigFiveResults";

const LIKERT_VALUES = [1, 2, 3, 4, 5];

export function BigFiveQuiz() {
  const t = useTranslations("bigFive");
  const { view, index, answers, scores, start, answer, back, retake } = useBigFiveQuiz();

  if (view === "results") {
    return <BigFiveResults scores={scores} onRetake={retake} />;
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

  const item = BIG_FIVE_ITEMS[index];
  const current = index + 1;
  const total = BIG_FIVE_ITEMS.length;
  const percent = Math.round((index / total) * 100);
  const selected = answers[item.id];

  return (
    <div>
      <p className="mb-2 text-sm text-foreground/60">
        {t("progressLabel", { current, total })}
      </p>
      <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-brand-gray/30">
        <div
          className="h-full rounded-full bg-brand-yellow transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${percent}%` }}
        />
      </div>

      <h2 className="mb-8 text-xl font-semibold">{t(item.textKey)}</h2>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {LIKERT_VALUES.map((value) => (
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
