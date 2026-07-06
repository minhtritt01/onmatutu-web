import { useMemo, useState } from "react";
import { BIG_FIVE_ITEMS, scoreAll, type Answers, type DomainScore } from "@/lib/big-five-items";

export type BigFiveView = "intro" | "quiz" | "results";

export type BigFiveQuizState = {
  view: BigFiveView;
  index: number;
  answers: Answers;
  scores: DomainScore[];
  start: () => void;
  answer: (value: number) => void;
  back: () => void;
  retake: () => void;
};

export function useBigFiveQuiz(): BigFiveQuizState {
  const [view, setView] = useState<BigFiveView>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);

  function start() {
    setView("quiz");
  }

  function answer(value: number) {
    const item = BIG_FIVE_ITEMS[index];
    setAnswers((prev) => ({ ...prev, [item.id]: value }));
    if (index < BIG_FIVE_ITEMS.length - 1) {
      setIndex((i) => i + 1);
    } else {
      setView("results");
    }
  }

  function back() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function retake() {
    setAnswers({});
    setIndex(0);
    setView("intro");
  }

  const scores = useMemo(() => scoreAll(answers), [answers]);

  return { view, index, answers, scores, start, answer, back, retake };
}
