import { useCallback, useEffect, useRef, useState } from "react";
import { nextPhase, type BreathingPattern, type BreathPhase } from "@/lib/breathing-patterns";

export type BreathingClock = {
  phase: BreathPhase;
  secondsLeft: number;
  running: boolean;
  progressRef: React.RefObject<number>;
  cycleId: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
};

export function useBreathingClock(pattern: BreathingPattern): BreathingClock {
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [secondsLeft, setSecondsLeft] = useState(pattern.durations.inhale);
  const [running, setRunning] = useState(false);
  const [cycleId, setCycleId] = useState(0);

  const patternRef = useRef(pattern);
  const phaseRef = useRef<BreathPhase>("inhale");
  const phaseStartRef = useRef(0);
  const pausedElapsedMsRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const cycleIdRef = useRef(0);
  const lastSecondsRef = useRef(pattern.durations.inhale);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    patternRef.current = pattern;
  }, [pattern]);

  const tick = useCallback((now: number) => {
    if (!runningRef.current) return;

    let elapsed = now - phaseStartRef.current;
    let durationMs = patternRef.current.durations[phaseRef.current] * 1000;

    while (durationMs > 0 && elapsed >= durationMs) {
      phaseStartRef.current += durationMs;
      elapsed -= durationMs;
      phaseRef.current = nextPhase(patternRef.current, phaseRef.current);
      durationMs = patternRef.current.durations[phaseRef.current] * 1000;
      cycleIdRef.current += 1;
      setPhase(phaseRef.current);
      setCycleId(cycleIdRef.current);
    }

    progressRef.current = durationMs > 0 ? elapsed / durationMs : 1;
    const secs = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
    if (secs !== lastSecondsRef.current) {
      lastSecondsRef.current = secs;
      setSecondsLeft(secs);
    }

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    if (pausedElapsedMsRef.current == null) {
      phaseRef.current = "inhale";
      phaseStartRef.current = performance.now();
      progressRef.current = 0;
      lastSecondsRef.current = patternRef.current.durations.inhale;
      cycleIdRef.current += 1;
      setPhase("inhale");
      setSecondsLeft(patternRef.current.durations.inhale);
      setCycleId(cycleIdRef.current);
    } else {
      phaseStartRef.current = performance.now() - pausedElapsedMsRef.current;
      pausedElapsedMsRef.current = null;
    }
    runningRef.current = true;
    setRunning(true);
    stopLoop();
    rafRef.current = requestAnimationFrame(tick);
  }, [stopLoop, tick]);

  const pause = useCallback(() => {
    if (runningRef.current) {
      pausedElapsedMsRef.current = performance.now() - phaseStartRef.current;
    }
    runningRef.current = false;
    setRunning(false);
    stopLoop();
  }, [stopLoop]);

  const reset = useCallback(() => {
    pausedElapsedMsRef.current = null;
    runningRef.current = false;
    phaseRef.current = "inhale";
    progressRef.current = 0;
    lastSecondsRef.current = patternRef.current.durations.inhale;
    cycleIdRef.current += 1;
    stopLoop();
    setRunning(false);
    setPhase("inhale");
    setSecondsLeft(patternRef.current.durations.inhale);
    setCycleId(cycleIdRef.current);
  }, [stopLoop]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pattern.id]);

  useEffect(() => {
    function onVisibilityChange() {
      if (document.hidden) {
        if (runningRef.current) {
          stopLoop();
          pausedElapsedMsRef.current = performance.now() - phaseStartRef.current;
        }
      } else if (runningRef.current && pausedElapsedMsRef.current != null) {
        phaseStartRef.current = performance.now() - pausedElapsedMsRef.current;
        pausedElapsedMsRef.current = null;
        rafRef.current = requestAnimationFrame(tick);
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [stopLoop, tick]);

  useEffect(() => stopLoop, [stopLoop]);

  return { phase, secondsLeft, running, progressRef, cycleId, start, pause, reset };
}
