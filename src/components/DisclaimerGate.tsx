"use client";

import { useTranslations } from "next-intl";

export function DisclaimerGate({
  namespace,
  onAcknowledge,
}: {
  namespace: string;
  onAcknowledge: () => void;
}) {
  const t = useTranslations(namespace);

  return (
    <div className="rounded-2xl border border-brand-gray p-6">
      <h2 className="mb-3 text-lg font-semibold">{t("disclaimerGate.heading")}</h2>
      <p className="mb-6 text-sm text-foreground/70">{t("disclaimerGate.body")}</p>
      <button
        onClick={onAcknowledge}
        className="cursor-pointer rounded-full bg-brand-yellow px-6 py-2.5 text-sm font-semibold text-[#2b2b2b] transition-colors duration-200 hover:opacity-90"
      >
        {t("disclaimerGate.ackCta")}
      </button>
    </div>
  );
}
