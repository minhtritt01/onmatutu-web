"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

type Stat = { key: string; value: number };
type Props = { stats: readonly Stat[] };

const DURATION = 1400; // count-up duration in ms

// 480000 -> "480K", 1200000 -> "1.2M", 25 -> "25"
function formatCompact(n: number): string {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return `${v % 1 === 0 ? v : v.toFixed(1)}M`;
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return `${v % 1 === 0 ? v : v.toFixed(1)}K`;
  }
  return `${n}`;
}

// Turns "followers" -> "statFollowers" to look up the i18n label.
function labelKey(key: string): string {
  return `stat${key.charAt(0).toUpperCase()}${key.slice(1)}`;
}

// Generic icon lookup by stat key. Unknown keys fall back to a spark icon,
// so new stats still render nicely without a code change.
const ICONS: Record<string, ReactNode> = {
  followers: (
    <path d="M17 20h5v-1a4 4 0 0 0-3-3.87M9 20H4v-1a4 4 0 0 1 3-3.87m10-4.13a3 3 0 1 0-4-4m-4 4a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  ),
  likes: (
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  ),
  videos: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m10 9 5 3-5 3V9Z" />
    </>
  ),
};

const FALLBACK_ICON = (
  <path d="M12 3v4m0 10v4m9-9h-4M7 12H3m14.5-6.5-2.8 2.8M9.3 14.7l-2.8 2.8m11 0-2.8-2.8M9.3 9.3 6.5 6.5" />
);

export function StatsStrip({ stats }: Props) {
  const t = useTranslations("home");
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 -> 1

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      setProgress(1);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / DURATION, 1);
          setProgress(1 - Math.pow(1 - p, 3)); // easeOutCubic
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-3xl border border-brand-yellow/25 bg-gradient-to-br from-brand-yellow/[0.08] via-transparent to-brand-navy/[0.06] p-6 shadow-[0_8px_40px_-12px_rgba(244,201,93,0.25)] sm:p-8"
    >
      {/* soft warm glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-yellow/20 blur-3xl"
      />

      <div className="relative grid grid-cols-3 divide-x divide-brand-gray/40">
        {stats.map((stat) => (
          <div
            key={stat.key}
            className="flex flex-col items-center gap-2 px-2 text-center sm:gap-2.5 sm:px-4"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-yellow/15 text-brand-yellow ring-1 ring-inset ring-brand-yellow/25 sm:h-12 sm:w-12">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 sm:h-6 sm:w-6"
                aria-hidden
              >
                {ICONS[stat.key] ?? FALLBACK_ICON}
              </svg>
            </span>
            <span className="text-3xl font-extrabold tabular-nums leading-none tracking-tight text-foreground sm:text-4xl">
              {formatCompact(Math.round(stat.value * progress))}
            </span>
            <span className="text-xs font-medium uppercase tracking-wide text-foreground/55 sm:text-sm">
              {t(labelKey(stat.key))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
