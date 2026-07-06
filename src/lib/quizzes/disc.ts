import type { QuizDefinition, QuizItem } from "@/lib/quiz-engine";

function domainItems(category: string, startId: number, count: number): QuizItem[] {
  return Array.from({ length: count }, (_, i) => ({ id: startId + i, category }));
}

export const discQuiz: QuizDefinition = {
  id: "disc",
  namespace: "disc",
  mode: "domain-percent",
  categories: ["D", "I", "S", "C"],
  items: [
    ...domainItems("D", 1, 7),
    ...domainItems("I", 8, 7),
    ...domainItems("S", 15, 7),
    ...domainItems("C", 22, 7),
  ],
};
