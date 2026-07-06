import type { IconProps } from "@/components/result-icons/icon-system";

type Letter = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

function miniGlyph(letter: Letter) {
  switch (letter) {
    case "E":
      return <circle cx="6" cy="6" r="3.2" fill="currentColor" stroke="none" />;
    case "I":
      return <circle cx="6" cy="6" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />;
    case "S":
      return <rect x="3" y="3" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />;
    case "N":
      return (
        <path
          d="M6 2.5L7.2 5l2.6.4-1.9 1.8.5 2.6L6 8.5 3.6 9.8l.5-2.6L2.2 5.4 4.8 5z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      );
    case "T":
      return (
        <>
          <circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M6 3v1.4M6 7.6V9M3 6h1.4M7.6 6H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </>
      );
    case "F":
      return (
        <path
          d="M6 9.5S2.5 7.2 2.5 4.9C2.5 3.6 3.4 3 4.3 3c.7 0 1.3.4 1.6.9.1.2.4.2.5 0C6.7 3.4 7.3 3 8 3c1 0 1.8.6 1.8 1.9C9.5 7.2 6 9.5 6 9.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
      );
    case "J":
      return (
        <path
          d="M3.3 6.2l1.7 1.7L9 3.7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case "P":
      return (
        <path
          d="M2.5 6.5c1-1.6 1.7 1.6 2.7 0s1.7-1.6 2.7 0 1.7 1.6 2.6 0"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      );
  }
}

function MbtiIcon({ code, className }: IconProps & { code: string }) {
  const letters = code.split("") as Letter[];
  const positions: [number, number][] = [
    [0, 0],
    [12, 0],
    [0, 12],
    [12, 12],
  ];

  return (
    <svg viewBox="0 0 24 24" className={className ?? "h-7 w-7"}>
      {letters.map((letter, i) => (
        <g key={i} transform={`translate(${positions[i][0]}, ${positions[i][1]})`}>
          {miniGlyph(letter)}
        </g>
      ))}
    </svg>
  );
}

const CODES = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ",
];

export const mbtiIcons: Record<string, (props: IconProps) => React.JSX.Element> = Object.fromEntries(
  CODES.map((code) => [code, (props: IconProps) => <MbtiIcon code={code} {...props} />]),
);
