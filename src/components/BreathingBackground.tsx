"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { getRelaxBackgrounds, type RelaxBackground } from "@/lib/relax-content";
import { FullscreenContext } from "@/lib/fullscreen-context";

type ThemeId = "yellow" | "blue" | "purple" | "green";

const THEMES: { id: ThemeId; swatch: string }[] = [
  { id: "yellow", swatch: "#f4c95d" },
  { id: "blue", swatch: "#7abee8" },
  { id: "purple", swatch: "#c87ab0" },
  { id: "green", swatch: "#7ae8b8" },
];

const STORAGE_KEY = "relax-breathing-theme";
const IMAGE_STORAGE_KEY = "relax-breathing-image-bg";
const FULLSCREEN_HINT_KEY = "relax-breathing-fullscreen-hint-seen";

export function BreathingBackground({ children }: { children: ReactNode }) {
  const t = useTranslations("breathingTool.background");
  const [themeId, setThemeId] = useState<ThemeId>("yellow");
  const [backgrounds, setBackgrounds] = useState<RelaxBackground[]>([]);
  const [imageBg, setImageBg] = useState<RelaxBackground | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullscreenHint, setShowFullscreenHint] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(true);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (typeof document.documentElement.requestFullscreen !== "function") {
      setFullscreenSupported(false);
    }
  }, []);

  useEffect(() => {
    if (!window.localStorage.getItem(FULLSCREEN_HINT_KEY)) {
      setShowFullscreenHint(true);
    }
  }, []);

  function toggleFullscreen() {
    setShowFullscreenHint(false);
    window.localStorage.setItem(FULLSCREEN_HINT_KEY, "1");
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current?.requestFullscreen();
    }
  }

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (saved && THEMES.some((theme) => theme.id === saved)) setThemeId(saved);
  }, []);

  useEffect(() => {
    getRelaxBackgrounds().then(setBackgrounds);
  }, []);

  useEffect(() => {
    if (backgrounds.length === 0) return;
    const savedId = window.localStorage.getItem(IMAGE_STORAGE_KEY);
    if (savedId) {
      const match = backgrounds.find((bg) => bg.id === savedId);
      if (match) setImageBg(match);
    }
  }, [backgrounds]);

  function handleSelect(id: ThemeId) {
    setThemeId(id);
    window.localStorage.setItem(STORAGE_KEY, id);
    setImageBg(null);
    window.localStorage.removeItem(IMAGE_STORAGE_KEY);
  }

  function handleSelectImage(bg: RelaxBackground) {
    setImageBg(bg);
    window.localStorage.setItem(IMAGE_STORAGE_KEY, bg.id);
  }

  return (
    <div
      ref={containerRef}
      className={`relax-bg-${themeId} relative isolate overflow-hidden transition-colors ${
        isFullscreen
          ? "relax-fullscreen flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-background px-4 py-8"
          : "-mx-4 rounded-3xl px-4 py-6 sm:-mx-6 sm:px-6"
      }`}
      style={
        imageBg || isFullscreen
          ? ({
              "--foreground": "#ffffff",
              "--background": "#1a1a1a",
              "--color-brand-gray": "rgba(255,255,255,0.35)",
            } as React.CSSProperties)
          : undefined
      }
    >
      <button
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? t("collapseFullscreen") : t("expandFullscreen")}
        className={`absolute top-3 right-3 z-10 hidden h-8 w-8 items-center justify-center rounded-full border border-brand-gray bg-background/60 text-foreground/70 backdrop-blur-sm transition hover:text-foreground sm:flex ${
          showFullscreenHint && !isFullscreen ? "fullscreen-hint" : ""
        }`}
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M9 3v4a2 2 0 0 1-2 2H3M21 8h-4a2 2 0 0 1-2-2V3M3 16h4a2 2 0 0 1 2 2v4M16 21v-4a2 2 0 0 1 2-2h4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4" />
          </svg>
        )}
      </button>
      {imageBg && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageBg.imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-10 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-black/60" />
        </>
      )}
      {/* Mobile: compact card with icon groups + larger tap targets */}
      <div className="mb-6 flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-black/15 px-4 py-3 shadow-sm backdrop-blur-md sm:hidden">
        <div className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-foreground/45"
          >
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2a10 10 0 1 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.4-.3-.4-.5-.9-.5-1.4 0-1.1.9-2 2-2h2.4c1.7 0 3.1-1.4 3.1-3.1C20.5 6.6 16.7 2 12 2Z" />
          </svg>
          <span className="sr-only">{t("label")}</span>
          <div className="flex items-center gap-2">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => handleSelect(theme.id)}
                aria-label={t(`themes.${theme.id}`)}
                aria-pressed={!imageBg && themeId === theme.id}
                className={`h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-transparent transition active:scale-95 ${
                  !imageBg && themeId === theme.id ? "ring-foreground" : "ring-transparent"
                }`}
                style={{ background: theme.swatch }}
              />
            ))}
          </div>
        </div>

        {backgrounds.length > 0 && (
          <>
            <span className="block h-px w-16 bg-white/20" aria-hidden="true" />
            <div className="flex items-center gap-2.5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
                className="h-4 w-4 shrink-0 text-foreground/45"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="8.5" cy="9.5" r="1.5" fill="currentColor" stroke="none" />
                <path d="m21 15-5-5-11 9" />
              </svg>
              <span className="sr-only">{t("imageLabel")}</span>
              <div className="flex items-center gap-2">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => handleSelectImage(bg)}
                    aria-label={bg.labelVi || bg.labelEn}
                    aria-pressed={imageBg?.id === bg.id}
                    style={{ WebkitTouchCallout: "none" }}
                    className={`h-8 w-8 overflow-hidden rounded-full bg-cover bg-center ring-2 ring-offset-2 ring-offset-transparent transition active:scale-95 ${
                      imageBg?.id === bg.id ? "ring-foreground" : "ring-transparent"
                    }`}
                  >
                    <span
                      className="block h-full w-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${bg.imageUrl})` }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Desktop/tablet: original compact inline row */}
      <div className="mb-6 hidden flex-wrap items-center justify-center gap-2 sm:flex sm:pr-12">
        <span className="text-xs text-foreground/50">{t("label")}</span>
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleSelect(theme.id)}
            aria-label={t(`themes.${theme.id}`)}
            aria-pressed={!imageBg && themeId === theme.id}
            className={`h-6 w-6 rounded-full border-2 transition ${
              !imageBg && themeId === theme.id ? "border-foreground" : "border-transparent"
            }`}
            style={{ background: theme.swatch }}
          />
        ))}
        {backgrounds.length > 0 && (
          <>
            <span className="mx-1 text-xs text-foreground/30">|</span>
            <span className="text-xs text-foreground/50">{t("imageLabel")}</span>
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => handleSelectImage(bg)}
                aria-label={bg.labelVi || bg.labelEn}
                aria-pressed={imageBg?.id === bg.id}
                className={`h-6 w-6 overflow-hidden rounded-full border-2 bg-cover bg-center transition ${
                  imageBg?.id === bg.id ? "border-foreground" : "border-transparent"
                }`}
                style={{ backgroundImage: `url(${bg.imageUrl})` }}
              />
            ))}
          </>
        )}
      </div>
      <FullscreenContext.Provider value={isFullscreen}>{children}</FullscreenContext.Provider>
    </div>
  );
}
