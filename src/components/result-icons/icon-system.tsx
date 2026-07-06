import type { ReactNode } from "react";

export type IconProps = { className?: string };

export function IconBadge({
  children,
  tone = "yellow",
  size = "md",
}: {
  children: ReactNode;
  tone?: "yellow" | "navy";
  size?: "md" | "lg";
}) {
  const dimension = size === "lg" ? "h-16 w-16" : "h-14 w-14";
  const bg = tone === "yellow" ? "bg-brand-yellow/10 text-brand-yellow" : "bg-brand-navy/10 text-brand-navy";

  return (
    <div className={`flex ${dimension} shrink-0 items-center justify-center rounded-full ${bg}`}>
      {children}
    </div>
  );
}

export function FallbackIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={className ?? "h-7 w-7"}>
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}
