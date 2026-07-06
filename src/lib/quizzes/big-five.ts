import type { QuizDefinition, QuizItem } from "@/lib/quiz-engine";

function buildDomainItems(
  category: string,
  startId: number,
  reverseFlags: boolean[],
): QuizItem[] {
  return reverseFlags.map((reverseScored, i) => ({
    id: startId + i,
    category,
    reverseScored,
  }));
}

export const bigFiveQuiz: QuizDefinition = {
  id: "big-five",
  namespace: "bigFive",
  mode: "domain-percent",
  categories: ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"],
  items: [
    ...buildDomainItems("openness", 1, [
      false, false, false, false, false, false,
      true, true, true, true, true,
      false,
    ]),
    ...buildDomainItems("conscientiousness", 13, [
      false, false, false, false, false, false,
      true, true, true, true, true,
      false,
    ]),
    ...buildDomainItems("extraversion", 25, [
      false, false, false, false, false, false,
      true, true, true, true, true, true,
    ]),
    ...buildDomainItems("agreeableness", 37, [
      false, false, false, false, false, false,
      true, true, true, true, true, true,
    ]),
    ...buildDomainItems("neuroticism", 49, [
      false, false, false, false, false, false,
      true, true, true, true, true, true,
    ]),
  ],
};
