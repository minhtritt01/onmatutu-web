"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BREATHING_PATTERNS,
  DEFAULT_PATTERN_ID,
  getPattern,
  nextPhase,
  type BreathPhase,
  type PatternId,
} from "@/lib/breathing-patterns";
import { BreathingCircle } from "@/components/BreathingCircle";
import { AmbientPlayer } from "@/components/AmbientPlayer";
import { useIsFullscreen } from "@/lib/fullscreen-context";

const PHASE_LABEL_KEY: Record<BreathPhase, string> = {
  inhale: "phaseInhale",
  hold1: "phaseHold",
  exhale: "phaseExhale",
  hold2: "phaseHold",
};

export function BreathingTool() {
  const t = useTranslations("breathingTool");
  const isFullscreen = useIsFullscreen();
  const [showAmbient, setShowAmbient] = useState(false);
  const searchParams = useSearchParams();
  const initialPatternId = (searchParams.get("pattern") as PatternId) || DEFAULT_PATTERN_ID;

  const [patternId, setPatternId] = useState<PatternId>(
    BREATHING_PATTERNS.some((p) => p.id === initialPatternId) ? initialPatternId : DEFAULT_PATTERN_ID,
  );
  const pattern = getPattern(patternId);

  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(pattern.durations.inhale);
  const [soundOn, setSoundOn] = useState(false);

  const chimeRef = useRef<HTMLAudioElement | null>(null);
  const phaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function clearTimers() {
    if (phaseTimeoutRef.current) clearTimeout(phaseTimeoutRef.current);
    if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
    phaseTimeoutRef.current = null;
    tickIntervalRef.current = null;
  }

  useEffect(() => {
    if (!running) {
      clearTimers();
      return;
    }

    const durationSec = pattern.durations[phase];
    setSecondsLeft(durationSec);

    if (soundOn) {
      const audio = chimeRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }

    tickIntervalRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    phaseTimeoutRef.current = setTimeout(() => {
      setPhase((p) => nextPhase(pattern, p));
    }, durationSec * 1000);

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase, patternId]);

  function handleStart() {
    setPhase("inhale");
    setRunning(true);
  }

  function handlePause() {
    setRunning(false);
  }

  function handleReset() {
    setRunning(false);
    setPhase("inhale");
    setSecondsLeft(pattern.durations.inhale);
  }

  function handlePatternChange(id: PatternId) {
    setRunning(false);
    setPatternId(id);
    setPhase("inhale");
    const next = getPattern(id);
    setSecondsLeft(next.durations.inhale);
  }

  const patternPicker = (
    <div className="flex flex-wrap justify-center gap-2">
      {BREATHING_PATTERNS.map((p) => (
        <button
          key={p.id}
          onClick={() => handlePatternChange(p.id)}
          aria-pressed={patternId === p.id}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            patternId === p.id
              ? "border-brand-yellow bg-brand-yellow/10 text-foreground"
              : "border-brand-gray text-foreground/70 hover:border-brand-yellow"
          }`}
        >
          {t(`patterns.${p.id}.label`)}
        </button>
      ))}
    </div>
  );

  const circle = (
    <BreathingCircle
      phase={phase}
      durationSec={pattern.durations[phase]}
      running={running}
      label={running ? `${t(PHASE_LABEL_KEY[phase])} · ${secondsLeft}s` : t("readyLabel")}
    />
  );

  const startPauseButton = !running ? (
    <button
      onClick={handleStart}
      className="rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-semibold text-[#2b2b2b] transition hover:opacity-90"
    >
      {t("start")}
    </button>
  ) : (
    <button
      onClick={handlePause}
      className="rounded-full border border-brand-gray px-6 py-2.5 text-sm font-semibold text-foreground transition hover:border-brand-yellow"
    >
      {t("pause")}
    </button>
  );

  const resetButton = (
    <button
      onClick={handleReset}
      className="rounded-full border border-brand-gray px-6 py-2.5 text-sm text-foreground/70 transition hover:border-brand-yellow"
    >
      {t("reset")}
    </button>
  );

  const soundButton = (
    <button
      onClick={() => setSoundOn((v) => !v)}
      aria-label={soundOn ? t("soundOff") : t("soundOn")}
      aria-pressed={soundOn}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-gray text-foreground/70 transition hover:border-brand-yellow"
    >
      {soundOn ? "🔔" : "🔕"}
    </button>
  );

  if (isFullscreen) {
    return (
      <div className="flex h-full w-full flex-col items-center">
        <audio ref={chimeRef} src="/sounds/chime.mp3" preload="auto" />

        <div className="flex flex-1 flex-col items-center justify-center gap-6 pb-24">
          {patternPicker}
          <p className="max-w-sm text-center text-sm text-foreground/60">
            {t(`patterns.${patternId}.description`)}
          </p>
          {circle}
        </div>

        <div className="fixed inset-x-0 bottom-0 z-20 flex flex-wrap items-center justify-center gap-3 border-t border-brand-gray bg-background/80 px-4 py-3 backdrop-blur-sm">
          {startPauseButton}
          {resetButton}
          {soundButton}
          <button
            onClick={() => setShowAmbient((v) => !v)}
            aria-pressed={showAmbient}
            aria-label={t("ambient.title")}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
              showAmbient
                ? "border-brand-yellow text-brand-yellow"
                : "border-brand-gray text-foreground/70 hover:border-brand-yellow"
            }`}
          >
            🎵
          </button>
        </div>

        {showAmbient && (
          <div className="fixed right-4 bottom-16 z-20">
            <AmbientPlayer />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <audio ref={chimeRef} src="/sounds/chime.mp3" preload="auto" />

      {patternPicker}

      <p className="max-w-sm text-center text-sm text-foreground/60">
        {t(`patterns.${patternId}.description`)}
      </p>

      {circle}

      <div className="flex flex-wrap items-center justify-center gap-3">
        {startPauseButton}
        {resetButton}
        {soundButton}
      </div>

      <p className="max-w-sm text-center text-xs text-foreground/40">{t("reducedMotionNotice")}</p>

      <AmbientPlayer />
    </div>
  );
}
