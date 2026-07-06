export type ScoringMode = "domain-percent" | "highest-wins" | "dichotomy" | "severity-sum";

export type QuizItem = {
  id: number;
  category: string;
  reverseScored?: boolean;
};

export type SeverityBand = {
  max: number;
  key: string;
};

export type QuizDefinition = {
  id: string;
  namespace: string;
  mode: ScoringMode;
  categories: string[];
  items: QuizItem[];
  dichotomies?: [string, string][];
  answerScale?: { min: number; max: number };
  severityBands?: SeverityBand[];
  crisisItemId?: number;
  crisisThreshold?: number;
};

export type Answers = Partial<Record<number, number>>;

export type CategoryScore = {
  category: string;
  average: number;
  percent: number;
};

export type DichotomyPairResult = {
  poles: [string, string];
  percent: [number, number];
  winner: string;
};

export type DichotomyResult = {
  pairs: DichotomyPairResult[];
  code: string;
};

function scoredValue(item: QuizItem, raw: number): number {
  return item.reverseScored ? 6 - raw : raw;
}

function averageForCategory(items: QuizItem[], category: string, answers: Answers): number {
  const values = items
    .filter((item) => item.category === category)
    .map((item) => {
      const raw = answers[item.id];
      if (raw == null) return null;
      return scoredValue(item, raw);
    })
    .filter((v): v is number => v != null);

  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
}

function percentFromAverage(average: number): number {
  return average > 0 ? Math.round(((average - 1) / 4) * 100) : 0;
}

export function scoreDomainPercent(def: QuizDefinition, answers: Answers): CategoryScore[] {
  return def.categories.map((category) => {
    const average = averageForCategory(def.items, category, answers);
    return { category, average, percent: percentFromAverage(average) };
  });
}

export function scoreHighestWins(def: QuizDefinition, answers: Answers): CategoryScore[] {
  return scoreDomainPercent(def, answers).sort((a, b) => b.average - a.average);
}

export function scoreDichotomy(def: QuizDefinition, answers: Answers): DichotomyResult {
  const dichotomies = def.dichotomies ?? [];
  const pairs: DichotomyPairResult[] = dichotomies.map(([a, b]) => {
    const avgA = averageForCategory(def.items, a, answers);
    const avgB = averageForCategory(def.items, b, answers);
    const total = avgA + avgB;
    const percentA = total > 0 ? Math.round((avgA / total) * 100) : 50;
    const percentB = 100 - percentA;
    return {
      poles: [a, b],
      percent: [percentA, percentB],
      winner: avgA >= avgB ? a : b,
    };
  });

  return { pairs, code: pairs.map((p) => p.winner).join("") };
}

export type SeveritySumResult = {
  total: number;
  band: string;
  crisis: boolean;
};

export function scoreSeveritySum(def: QuizDefinition, answers: Answers): SeveritySumResult {
  const total = def.items.reduce((sum, item) => sum + (answers[item.id] ?? 0), 0);

  const bands = def.severityBands ?? [];
  const band = bands.find((b) => total <= b.max)?.key ?? bands[bands.length - 1]?.key ?? "";

  const crisisFromItem = def.crisisItemId != null && (answers[def.crisisItemId] ?? 0) > 0;
  const crisisFromThreshold = def.crisisThreshold != null && total >= def.crisisThreshold;

  return { total, band, crisis: crisisFromItem || crisisFromThreshold };
}

export function isComplete(def: QuizDefinition, answers: Answers): boolean {
  return def.items.every((item) => answers[item.id] != null);
}
