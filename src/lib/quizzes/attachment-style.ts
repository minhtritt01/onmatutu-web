import type { QuizDefinition, QuizItem } from "@/lib/quiz-engine";

function styleItems(category: string, startId: number, count: number): QuizItem[] {
  return Array.from({ length: count }, (_, i) => ({ id: startId + i, category }));
}

export const attachmentStyleQuiz: QuizDefinition = {
  id: "attachment-style",
  namespace: "attachmentStyle",
  mode: "highest-wins",
  categories: ["secure", "anxious", "avoidant", "fearful"],
  items: [
    ...styleItems("secure", 1, 6),
    ...styleItems("anxious", 7, 6),
    ...styleItems("avoidant", 13, 6),
    ...styleItems("fearful", 19, 6),
  ],
};
