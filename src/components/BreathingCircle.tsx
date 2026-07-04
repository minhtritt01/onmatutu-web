"use client";

import type { BreathPhase } from "@/lib/breathing-patterns";

type Props = {
  phase: BreathPhase;
  durationSec: number;
  running: boolean;
  label: string;
};

export function BreathingCircle({ phase, durationSec, running, label }: Props) {
  const animationName =
    phase === "inhale" ? "breathe-inhale" : phase === "exhale" ? "breathe-exhale" : undefined;
  const isHolding = phase === "hold1" || phase === "hold2";

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div
        className="breathing-circle flex h-56 w-56 items-center justify-center rounded-full sm:h-72 sm:w-72"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(244,201,93,0.35) 0%, rgba(244,201,93,0.12) 60%, transparent 100%)",
          border: "2px solid rgba(244,201,93,0.5)",
          animationName: running ? animationName : undefined,
          animationDuration: `${durationSec}s`,
          animationTimingFunction: "ease-in-out",
          animationFillMode: "forwards",
          animationPlayState: running && !isHolding ? "running" : "paused",
        }}
      >
        <span className="text-center text-lg font-medium text-foreground sm:text-xl">
          {label}
        </span>
      </div>
    </div>
  );
}
