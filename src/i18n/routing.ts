import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["vi", "en"],
  defaultLocale: "vi",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

/** Returns the URL path segment for a given locale + path, omitting prefix for the default locale. */
export function localePath(locale: string, path: string = ""): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  return `${prefix}${path}`;
}
