"use client";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const t = useTranslations("langSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: Locale) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div className="flex items-center gap-0.5" aria-label={t("label")}>
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchLocale(l as Locale)}
          disabled={l === locale || isPending}
          className={`rounded px-1.5 py-0.5 text-xs font-medium uppercase tracking-wide transition
            ${l === locale
              ? "text-foreground"
              : "text-foreground/40 hover:text-foreground/80"
            }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
