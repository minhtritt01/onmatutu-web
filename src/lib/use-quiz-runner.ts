import { useMemo, useState } from "react";
import {
  scoreDomainPercent,
  scoreHighestWins,
  scoreDichotomy,
  type Answers,
  type QuizDefinition,
} from "@/lib/quiz-engine";

export type QuizView = "intro" | "quiz" | "results";

export function useQuizRunner(definition: QuizDefinition) {
  const [view, setView] = useState<QuizView>("intro");
  const [answers, setAnswers] = useState<Answers>({});
  const [index, setIndex] = useState(0);

  function start() {
    setView("quiz");
  }

  function answer(value: number) {
    const item = definition.items[index];
    setAnswers((prev) => ({ ...prev, [item.id]: value }));
    if (index < definition.items.length - 1) {
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

  const result = useMemo(() => {
    switch (definition.mode) {
      case "domain-percent":
        return { mode: "domain-percent" as const, scores: scoreDomainPercent(definition, answers) };
      case "highest-wins":
        return { mode: "highest-wins" as const, scores: scoreHighestWins(definition, answers) };
      case "dichotomy":
        return { mode: "dichotomy" as const, result: scoreDichotomy(definition, answers) };
    }
  }, [definition, answers]);

  return { view, index, answers, result, start, answer, back, retake };
}
