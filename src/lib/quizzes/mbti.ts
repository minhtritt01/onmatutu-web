import type { QuizDefinition, QuizItem } from "@/lib/quiz-engine";

function poleItems(category: string, startId: number, count: number): QuizItem[] {
  return Array.from({ length: count }, (_, i) => ({ id: startId + i, category }));
}

export const mbtiQuiz: QuizDefinition = {
  id: "mbti",
  namespace: "mbti",
  mode: "dichotomy",
  categories: ["E", "I", "S", "N", "T", "F", "J", "P"],
  dichotomies: [
    ["E", "I"],
    ["S", "N"],
    ["T", "F"],
    ["J", "P"],
  ],
  items: [
    ...poleItems("E", 1, 5),
    ...poleItems("I", 6, 5),
    ...poleItems("S", 11, 5),
    ...poleItems("N", 16, 5),
    ...poleItems("T", 21, 5),
    ...poleItems("F", 26, 5),
    ...poleItems("J", 31, 5),
    ...poleItems("P", 36, 5),
  ],
};
