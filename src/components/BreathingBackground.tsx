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

export function BreathingBackground({ children }: { children: ReactNode }) {
  const t = useTranslations("breathingTool.background");
  const [themeId, setThemeId] = useState<ThemeId>("yellow");
  const [backgrounds, setBackgrounds] = useState<RelaxBackground[]>([]);
  const [imageBg, setImageBg] = useState<RelaxBackground | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  function toggleFullscreen() {
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
      className={`relax-bg-${themeId} relative overflow-hidden transition-colors ${
        isFullscreen
          ? "flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-background px-4 py-8"
          : "-mx-4 rounded-3xl px-4 py-6 sm:-mx-6 sm:px-6"
      }`}
      style={
        imageBg
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
        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-brand-gray bg-background/60 text-foreground/70 backdrop-blur-sm transition hover:text-foreground"
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
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
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
