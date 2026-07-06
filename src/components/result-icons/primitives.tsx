import type { IconProps } from "@/components/result-icons/icon-system";

const BASE = "h-7 w-7";
const wrap = (className: string | undefined) => className ?? BASE;

export function Bulb({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path d="M9 17h6M10 20h4M8 10a4 4 0 1 1 8 0c0 2-1.5 3-2 4.5-.2.6-.3 1-.3 1.5h-3.4c0-.5-.1-.9-.3-1.5C9.5 13 8 12 8 10Z" />
    </svg>
  );
}

export function Box({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <rect x="5" y="5" width="14" height="14" rx="1.5" />
    </svg>
  );
}

export function Checkmark({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8.5 12.5l2.3 2.3L15.5 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ScribbleLine({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path d="M4 15c2-4 3 4 5 0s3-6 5-2 3 5 6 1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Sun({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <circle cx="12" cy="12" r="4" />
      <path
        strokeLinecap="round"
        d="M12 3v2.5M12 18.5V21M21 12h-2.5M5.5 12H3M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4L5.6 5.6"
      />
    </svg>
  );
}

export function DotInCircle({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function HeartOutline({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20s-7-4.4-9.3-9C1.3 7.8 2.7 5 5.6 5c1.8 0 3.2 1 3.9 2.3.2.4.8.4 1 0C11.2 6 12.6 5 14.4 5c2.9 0 4.3 2.8 2.9 6-2.3 4.6-9.3 9-9.3 9Z"
      />
    </svg>
  );
}

export function HeartFilled({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={wrap(className)}>
      <path d="M12 20s-7-4.4-9.3-9C1.3 7.8 2.7 5 5.6 5c1.8 0 3.2 1 3.9 2.3.2.4.8.4 1 0C11.2 6 12.6 5 14.4 5c2.9 0 4.3 2.8 2.9 6-2.3 4.6-9.3 9-9.3 9Z" />
    </svg>
  );
}

export function Shield({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path strokeLinejoin="round" d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Z" />
    </svg>
  );
}

export function ZigzagLine({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path d="M3 14l4-8 3 6 3-9 3 9 4-8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlatLine({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path d="M4 12h6l1.5-2 2 4 1.5-2H20" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function TriangleUp({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path strokeLinejoin="round" d="M12 4l8 15H4L12 4Z" />
    </svg>
  );
}

export function TriangleDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path strokeLinejoin="round" d="M12 20L4 5h16L12 20Z" />
    </svg>
  );
}

export function SpeechBubble({ dots, className }: IconProps & { dots: number }) {
  const positions = [8, 12, 16].slice(0, dots);
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path strokeLinejoin="round" d="M4 6h16v9H10l-3.5 3V15H4V6Z" />
      {positions.map((x) => (
        <circle key={x} cx={x} cy="10.5" r="0.9" fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}

export function Anchor({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <circle cx="12" cy="5" r="2" />
      <path strokeLinecap="round" d="M12 7v13M7 13a5 5 0 0 0 10 0M4.5 13h3M16.5 13h3" />
    </svg>
  );
}

export function Ruler({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path d="M4 8h16M7 8v3M11 8v3M15 8v3M4 8v9h16" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Blob({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 8c1-2 4-3 6-2s2 3 4 3 3 2 2 4-3 1-4 3-4 3-6 1-3-3-3-5 0-3 1-4Z"
      />
    </svg>
  );
}

export function Star({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path strokeLinejoin="round" d="M12 3.5l2.4 5 5.5.6-4 3.8 1 5.5-4.9-2.6-4.9 2.6 1-5.5-4-3.8 5.5-.6L12 3.5Z" />
    </svg>
  );
}

export function Teardrop({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path strokeLinejoin="round" d="M12 3s6 7 6 11a6 6 0 1 1-12 0c0-4 6-11 6-11Z" />
    </svg>
  );
}

export function MagnifyingGlass({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <circle cx="10.5" cy="10.5" r="6" />
      <path strokeLinecap="round" d="M15.2 15.2 20 20" />
    </svg>
  );
}

export function Burst({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path
        strokeLinecap="round"
        d="M12 2.5v4M12 17.5v4M21.5 12h-4M6.5 12h-4M18.8 5.2l-2.8 2.8M8 16l-2.8 2.8M18.8 18.8l-2.8-2.8M8 8 5.2 5.2"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function Chevron({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 16l6-8 6 8" />
    </svg>
  );
}

export function ConcentricCircles({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

export function Clock({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function GiftBox({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <rect x="4" y="10" width="16" height="10" rx="1" />
      <path d="M4 14h16M12 10v10" />
      <path strokeLinejoin="round" d="M12 10c0-3-2-5-3.5-5S6 6.5 8 8c1 .8 2.5 1.5 4 2Zm0 0c0-3 2-5 3.5-5S18 6.5 16 8c-1 .8-2.5 1.5-4 2Z" />
    </svg>
  );
}

export function Wrench({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.7 6.3a4 4 0 0 0-5.4 4.9L4 16.5 7.5 20l5.3-5.3a4 4 0 0 0 4.9-5.4l-2.6 2.6-2.1-2.1 2.7-2.5Z"
      />
    </svg>
  );
}

export function CrackedHeart({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className={wrap(className)}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20s-7-4.4-9.3-9C1.3 7.8 2.7 5 5.6 5c1.8 0 3.2 1 3.9 2.3.2.4.8.4 1 0C11.2 6 12.6 5 14.4 5c2.9 0 4.3 2.8 2.9 6-2.3 4.6-9.3 9-9.3 9Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 8l-1.5 3 2 2-1.5 3" />
    </svg>
  );
}
