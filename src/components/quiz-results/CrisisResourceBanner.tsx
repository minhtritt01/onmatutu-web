"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { SeveritySumResult } from "@/lib/quiz-engine";

type Hotline = { label: string; phone: string };

export function CrisisResourceBanner({
  namespace,
  result,
  onRetake,
}: {
  namespace: string;
  result: SeveritySumResult;
  onRetake: () => void;
}) {
  const t = useTranslations(namespace);
  const [acknowledged, setAcknowledged] = useState(false);
  const hotlines = t.raw("crisis.hotlines") as Hotline[];

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-brand-navy/40 bg-brand-navy/10 p-6">
        <h2 className="mb-2 text-lg font-semibold">{t("crisis.heading")}</h2>
        <p className="mb-5 text-sm text-foreground/70">{t("crisis.body")}</p>

        <ul className="mb-5 flex flex-col gap-2">
          {hotlines.map((hotline) => (
            <li key={hotline.phone}>
              <a
                href={`tel:${hotline.phone.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy transition-colors duration-200 hover:bg-brand-navy/10"
              >
                {hotline.label} · {hotline.phone}
              </a>
            </li>
          ))}
        </ul>

        {!acknowledged && (
          <button
            onClick={() => setAcknowledged(true)}
            className="cursor-pointer rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-semibold text-[#2b2b2b] transition-colors duration-200 hover:opacity-90"
          >
            {t("crisis.ackCta")}
          </button>
        )}
      </div>

      {acknowledged && (
        <div>
          <div className="mb-6 rounded-2xl border border-brand-gray p-6 opacity-80">
            <p className="mb-1 text-sm text-foreground/60">{result.total}</p>
            <h3 className="mb-2 text-lg font-semibold">{t(`bands.${result.band}.label`)}</h3>
            <p className="text-sm text-foreground/70">{t(`bands.${result.band}.blurb`)}</p>
          </div>

          <button
            onClick={onRetake}
            className="cursor-pointer rounded-full border border-brand-gray px-6 py-2.5 text-sm text-foreground/70 transition-colors duration-200 hover:border-brand-yellow"
          >
            {t("results.retake")}
          </button>
        </div>
      )}
    </div>
  );
}
