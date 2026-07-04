export type BreathPhase = "inhale" | "hold1" | "exhale" | "hold2";

export type PatternId = "box" | "478" | "coherent";

export type BreathingPattern = {
  id: PatternId;
  durations: Record<BreathPhase, number>; // seconds; 0 = phase is skipped
};

export const BREATHING_PATTERNS: BreathingPattern[] = [
  { id: "box", durations: { inhale: 4, hold1: 4, exhale: 4, hold2: 4 } },
  { id: "478", durations: { inhale: 4, hold1: 7, exhale: 8, hold2: 0 } },
  { id: "coherent", durations: { inhale: 5, hold1: 0, exhale: 5, hold2: 0 } },
];

export const DEFAULT_PATTERN_ID: PatternId = "box";

export function getPattern(id: string | null | undefined): BreathingPattern {
  return (
    BREATHING_PATTERNS.find((p) => p.id === id) ??
    BREATHING_PATTERNS.find((p) => p.id === DEFAULT_PATTERN_ID)!
  );
}

const PHASE_ORDER: BreathPhase[] = ["inhale", "hold1", "exhale", "hold2"];

/** Next phase in the cycle, skipping any phase whose duration is 0. */
export function nextPhase(pattern: BreathingPattern, current: BreathPhase): BreathPhase {
  let idx = PHASE_ORDER.indexOf(current);
  for (let i = 0; i < PHASE_ORDER.length; i++) {
    idx = (idx + 1) % PHASE_ORDER.length;
    const candidate = PHASE_ORDER[idx];
    if (pattern.durations[candidate] > 0) return candidate;
  }
  return current;
}
