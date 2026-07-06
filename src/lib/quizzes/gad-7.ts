import type { QuizDefinition, QuizItem } from "@/lib/quiz-engine";

const items: QuizItem[] = Array.from({ length: 7 }, (_, i) => ({
  id: i + 1,
  category: "total",
}));

export const gad7Quiz: QuizDefinition = {
  id: "gad-7",
  namespace: "gad7",
  mode: "severity-sum",
  categories: ["total"],
  items,
  answerScale: { min: 0, max: 3 },
  severityBands: [
    { max: 4, key: "minimal" },
    { max: 9, key: "mild" },
    { max: 14, key: "moderate" },
    { max: 21, key: "severe" },
  ],
};
