import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import { localePath } from "@/i18n/routing";
import { socialMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "quizHub" });
  const url = `${siteConfig.url}${localePath(locale, "/quiz")}`;
  return {
    title: t("title"),
    description: t("metaDescription"),
    alternates: {
      canonical: url,
      languages: {
        vi: `${siteConfig.url}/quiz`,
        en: `${siteConfig.url}/en/quiz`,
      },
    },
    ...socialMetadata({ locale, url, title: t("title"), description: t("metaDescription") }),
  };
}

const CARDS = [
  { slug: "bigFive", href: "/quiz/big-five" as const, screening: false },
  { slug: "mbti", href: "/quiz/mbti" as const, screening: false },
  { slug: "enneagram", href: "/quiz/enneagram" as const, screening: false },
  { slug: "disc", href: "/quiz/disc" as const, screening: false },
  { slug: "loveLanguages", href: "/quiz/love-languages" as const, screening: false },
  { slug: "attachmentStyle", href: "/quiz/attachment-style" as const, screening: false },
  { slug: "phq9", href: "/quiz/phq-9" as const, screening: true },
  { slug: "gad7", href: "/quiz/gad-7" as const, screening: true },
];

export default async function QuizHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("quizHub");

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-2xl font-semibold">{t("title")}</h1>
      <p className="mb-10 text-sm text-foreground/60">{t("intro")}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.slug}
            href={card.href}
            className="rounded-2xl border border-brand-gray p-6 transition hover:border-brand-yellow"
          >
            {card.screening && (
              <span className="mb-2 inline-block rounded-full bg-brand-navy/10 px-2 py-0.5 text-xs font-medium text-brand-navy">
                {t("screeningBadge")}
              </span>
            )}
            <h2 className="mb-1 text-lg font-semibold">{t(`cards.${card.slug}.title`)}</h2>
            <p className="text-sm text-foreground/60">{t(`cards.${card.slug}.description`)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
