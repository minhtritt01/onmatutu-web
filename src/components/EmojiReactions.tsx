"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const EMOJIS = ["💙", "😊", "😢", "💪", "✨"] as const;
type Emoji = (typeof EMOJIS)[number];

type Props = { slug: string };

export function EmojiReactions({ slug }: Props) {
  const t = useTranslations("reactions");
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [reacted, setReacted] = useState<string | null>(null);
  const storageKey = `reactions-${slug}`;

  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCounts(parsed.counts ?? {});
        setReacted(parsed.reacted ?? null);
      }
    } catch {}
  }, [storageKey]);

  function react(emoji: Emoji) {
    if (reacted === emoji) return;
    const newCounts = { ...counts, [emoji]: (counts[emoji] ?? 0) + 1 };
    if (reacted) {
      newCounts[reacted] = Math.max(0, (newCounts[reacted] ?? 1) - 1);
    }
    setCounts(newCounts);
    setReacted(emoji);
    try {
      localStorage.setItem(storageKey, JSON.stringify({ counts: newCounts, reacted: emoji }));
    } catch {}
  }

  const totalReactions = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="mt-10 border-t border-brand-gray pt-6">
      <p className="mb-3 text-sm text-foreground/60">{t("prompt")}</p>
      <div className="flex flex-wrap gap-3">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => react(emoji)}
            className={`flex flex-col items-center gap-0.5 rounded-xl border px-3 py-2 text-xl transition-all duration-150 ${
              reacted === emoji
                ? "scale-110 border-brand-yellow bg-brand-yellow/10"
                : "border-brand-gray hover:scale-105 hover:border-brand-yellow/60"
            }`}
          >
            <span>{emoji}</span>
            <span className="text-xs text-foreground/50">{counts[emoji] ?? 0}</span>
          </button>
        ))}
      </div>
      {totalReactions > 0 && (
        <p className="mt-3 text-xs text-foreground/50">
          {t("count", { n: totalReactions })}
        </p>
      )}
    </div>
  );
}
