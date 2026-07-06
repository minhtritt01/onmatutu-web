import type { QuizDefinition, QuizItem } from "@/lib/quiz-engine";

function categoryItems(category: string, startId: number, count: number): QuizItem[] {
  return Array.from({ length: count }, (_, i) => ({ id: startId + i, category }));
}

export const loveLanguagesQuiz: QuizDefinition = {
  id: "love-languages",
  namespace: "loveLanguages",
  mode: "highest-wins",
  categories: [
    "wordsOfAffirmation",
    "qualityTime",
    "receivingGifts",
    "actsOfService",
    "physicalTouch",
  ],
  items: [
    ...categoryItems("wordsOfAffirmation", 1, 5),
    ...categoryItems("qualityTime", 6, 5),
    ...categoryItems("receivingGifts", 11, 5),
    ...categoryItems("actsOfService", 16, 5),
    ...categoryItems("physicalTouch", 21, 5),
  ],
};
