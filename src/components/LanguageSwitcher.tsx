"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useTransition } from "react";

const FLAG: Record<Locale, string> = {
  vi: "🇻🇳",
  en: "🇺🇸",
};

const LABEL: Record<Locale, string> = {
  vi: "VI",
  en: "EN",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language">
      {routing.locales.map((l) => {
        const isActive = l === locale;
        return (
          <button
            key={l}
            onClick={() => switchLocale(l as Locale)}
            disabled={isPending}
            aria-pressed={isActive}
            aria-label={l === "vi" ? "Tiếng Việt" : "English"}
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all
              ${isActive
                ? "bg-brand-yellow text-foreground shadow-sm"
                : "text-foreground/50 hover:text-foreground/80"
              }
              ${isPending ? "opacity-60" : ""}
            `}
          >
            <span aria-hidden="true">{FLAG[l as Locale]}</span>
            {LABEL[l as Locale]}
          </button>
        );
      })}
    </div>
  );
}
