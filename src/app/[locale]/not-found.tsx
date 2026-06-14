import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-brand-yellow">404</p>
      <h1 className="mt-4 text-2xl font-semibold">{t("heading")}</h1>
      <p className="mt-3 text-foreground/60">{t("body")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-medium text-foreground transition hover:opacity-90"
      >
        {t("backHome")}
      </Link>
    </div>
  );
}
