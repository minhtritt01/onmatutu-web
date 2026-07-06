export type BigFiveDomain =
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "neuroticism";

export type BigFiveItem = {
  id: number;
  domain: BigFiveDomain;
  reverseScored: boolean;
  textKey: string;
};

export const BIG_FIVE_DOMAINS: BigFiveDomain[] = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "neuroticism",
];

function buildDomainItems(
  domain: BigFiveDomain,
  startId: number,
  reverseFlags: boolean[],
): BigFiveItem[] {
  return reverseFlags.map((reverseScored, i) => ({
    id: startId + i,
    domain,
    reverseScored,
    textKey: `items.item${startId + i}`,
  }));
}

export const BIG_FIVE_ITEMS: BigFiveItem[] = [
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
];

export type Answers = Partial<Record<number, number>>;

export type DomainScore = {
  domain: BigFiveDomain;
  average: number;
  percent: number;
};

export function scoreDomain(domain: BigFiveDomain, answers: Answers): DomainScore {
  const items = BIG_FIVE_ITEMS.filter((item) => item.domain === domain);
  const values = items
    .map((item) => {
      const raw = answers[item.id];
      if (raw == null) return null;
      return item.reverseScored ? 6 - raw : raw;
    })
    .filter((v): v is number => v != null);

  const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const percent = values.length ? Math.round(((average - 1) / 4) * 100) : 0;

  return { domain, average, percent };
}

export function scoreAll(answers: Answers): DomainScore[] {
  return BIG_FIVE_DOMAINS.map((domain) => scoreDomain(domain, answers));
}

export function isComplete(answers: Answers): boolean {
  return BIG_FIVE_ITEMS.every((item) => answers[item.id] != null);
}
