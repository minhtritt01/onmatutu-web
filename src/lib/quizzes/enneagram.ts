import type { QuizDefinition, QuizItem } from "@/lib/quiz-engine";

function typeItems(category: string, startId: number, count: number): QuizItem[] {
  return Array.from({ length: count }, (_, i) => ({ id: startId + i, category }));
}

export const enneagramQuiz: QuizDefinition = {
  id: "enneagram",
  namespace: "enneagram",
  mode: "highest-wins",
  categories: [
    "type1", "type2", "type3", "type4", "type5", "type6", "type7", "type8", "type9",
  ],
  items: [
    ...typeItems("type1", 1, 5),
    ...typeItems("type2", 6, 5),
    ...typeItems("type3", 11, 5),
    ...typeItems("type4", 16, 5),
    ...typeItems("type5", 21, 5),
    ...typeItems("type6", 26, 5),
    ...typeItems("type7", 31, 5),
    ...typeItems("type8", 36, 5),
    ...typeItems("type9", 41, 5),
  ],
};
