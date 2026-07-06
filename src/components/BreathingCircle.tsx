"use client";

import { useEffect, useRef, useState } from "react";
import type { BreathPhase } from "@/lib/breathing-patterns";

type Props = {
  phase: BreathPhase;
  durationSec: number;
  running: boolean;
  label: string;
  progressRef: React.RefObject<number>;
  cycleId: number;
};

const RESTING_TRANSFORM = "scale(0.6)";
const RESTING_OPACITY = "0.7";

export function BreathingCircle({ phase, durationSec, running, label, progressRef, cycleId }: Props) {
  const circleDivRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const isHolding = phase === "hold1" || phase === "hold2";
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    function onChange() {
      setPrefersReducedMotion(mq.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = circleDivRef.current;
    if (!el) return;

    animationRef.current?.cancel();
    animationRef.current = null;

    if (prefersReducedMotion) {
      el.style.transform = "";
      el.style.opacity = "";
      return;
    }

    if (!running) {
      el.style.transform = RESTING_TRANSFORM;
      el.style.opacity = RESTING_OPACITY;
      return;
    }

    if (isHolding) return;

    const keyframes =
      phase === "inhale"
        ? [
            { transform: RESTING_TRANSFORM, opacity: RESTING_OPACITY },
            { transform: "scale(1)", opacity: "1" },
          ]
        : [
            { transform: "scale(1)", opacity: "1" },
            { transform: RESTING_TRANSFORM, opacity: RESTING_OPACITY },
          ];

    animationRef.current = el.animate(keyframes, {
      duration: durationSec * 1000,
      easing: "ease-in-out",
      fill: "forwards",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleId, prefersReducedMotion]);

  useEffect(() => {
    const anim = animationRef.current;
    if (!anim) return;
    if (running) anim.play();
    else anim.pause();
  }, [running]);

  useEffect(() => {
    let raf: number;
    function loop() {
      const ring = ringRef.current;
      if (ring) {
        const progress = progressRef.current ?? 0;
        ring.style.strokeDashoffset = String(100 - progress * 100);
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative flex h-56 w-56 items-center justify-center sm:h-72 sm:w-72">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
          <circle
            cx="50"
            cy="50"
            r="46"
            pathLength={100}
            strokeWidth={3}
            className="fill-none stroke-brand-gray/30"
          />
          <circle
            ref={ringRef}
            cx="50"
            cy="50"
            r="46"
            pathLength={100}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={100}
            strokeDashoffset={100}
            className="fill-none stroke-brand-yellow"
          />
        </svg>
        <div
          ref={circleDivRef}
          className="breathing-circle flex h-56 w-56 items-center justify-center rounded-full sm:h-72 sm:w-72"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(244,201,93,0.35) 0%, rgba(244,201,93,0.12) 60%, transparent 100%)",
            border: "2px solid rgba(244,201,93,0.5)",
          }}
        >
          <span className="text-center text-lg font-medium text-foreground sm:text-xl">{label}</span>
        </div>
      </div>
    </div>
  );
}
