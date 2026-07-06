import type { QuizDefinition, QuizItem } from "@/lib/quiz-engine";

const items: QuizItem[] = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  category: "total",
}));

export const phq9Quiz: QuizDefinition = {
  id: "phq-9",
  namespace: "phq9",
  mode: "severity-sum",
  categories: ["total"],
  items,
  answerScale: { min: 0, max: 3 },
  severityBands: [
    { max: 4, key: "minimal" },
    { max: 9, key: "mild" },
    { max: 14, key: "moderate" },
    { max: 19, key: "moderatelySevere" },
    { max: 27, key: "severe" },
  ],
  crisisItemId: 9,
  crisisThreshold: 20,
};
