"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useTransition } from "react";

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
    <div
      className={`flex items-center gap-0.5 rounded-full border border-brand-gray p-0.5 text-xs font-semibold ${
        isPending ? "opacity-60" : ""
      }`}
      aria-label="Language"
    >
      {routing.locales.map((l) => {
        const isActive = l === locale;
        return (
          <button
            key={l}
            onClick={() => switchLocale(l as Locale)}
            disabled={isPending}
            aria-pressed={isActive}
            aria-label={l === "vi" ? "Tiếng Việt" : "English"}
            className={`rounded-full px-2.5 py-1 transition-all ${
              isActive ? "bg-brand-yellow text-foreground" : "text-foreground/50 hover:text-foreground/80"
            }`}
          >
            {LABEL[l as Locale]}
          </button>
        );
      })}
    </div>
  );
}
