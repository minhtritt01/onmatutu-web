"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  BREATHING_PATTERNS,
  DEFAULT_PATTERN_ID,
  getPattern,
  type BreathPhase,
  type PatternId,
} from "@/lib/breathing-patterns";
import { useBreathingClock } from "@/lib/use-breathing-clock";
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

  const { phase, secondsLeft, running, progressRef, cycleId, start, pause, reset } =
    useBreathingClock(pattern);
  const [soundOn, setSoundOn] = useState(false);

  const chimeRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!running) return;
    if (soundOn) {
      const audio = chimeRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycleId]);

  function handleStart() {
    start();
  }

  function handlePause() {
    pause();
  }

  function handleReset() {
    reset();
  }

  function handlePatternChange(id: PatternId) {
    setPatternId(id);
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
      progressRef={progressRef}
      cycleId={cycleId}
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
