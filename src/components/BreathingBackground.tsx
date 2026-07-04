"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

type ThemeId = "yellow" | "blue" | "purple" | "green";

const THEMES: { id: ThemeId; swatch: string }[] = [
  { id: "yellow", swatch: "#f4c95d" },
  { id: "blue", swatch: "#7abee8" },
  { id: "purple", swatch: "#c87ab0" },
  { id: "green", swatch: "#7ae8b8" },
];

const STORAGE_KEY = "relax-breathing-theme";

export function BreathingBackground({ children }: { children: ReactNode }) {
  const t = useTranslations("breathingTool.background");
  const [themeId, setThemeId] = useState<ThemeId>("yellow");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
    if (saved && THEMES.some((theme) => theme.id === saved)) setThemeId(saved);
  }, []);

  function handleSelect(id: ThemeId) {
    setThemeId(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className={`relax-bg-${themeId} -mx-4 rounded-3xl px-4 py-6 transition-colors sm:-mx-6 sm:px-6`}>
      <div className="mb-6 flex items-center justify-center gap-2">
        <span className="text-xs text-foreground/50">{t("label")}</span>
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleSelect(theme.id)}
            aria-label={t(`themes.${theme.id}`)}
            aria-pressed={themeId === theme.id}
            className={`h-6 w-6 rounded-full border-2 transition ${
              themeId === theme.id ? "border-foreground" : "border-transparent"
            }`}
            style={{ background: theme.swatch }}
          />
        ))}
      </div>
      {children}
    </div>
  );
}
