"use client";

import { useState, useTransition } from "react";
import { submitStory } from "@/lib/submit-story";

interface Props {
  t: {
    placeholder: string;
    submit: string;
    submitting: string;
    successTitle: string;
    successMessage: string;
    errorMessage: string;
    minLength: string;
    footer: string;
  };
}

export function ShareStoryForm({ t }: Props) {
  const [story, setStory] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error" | "too_short">("idle");
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    startTransition(async () => {
      const result = await submitStory(story, honeypot);
      if (result.success) {
        setStatus("success");
        setStory("");
      } else if (result.error === "too_short") {
        setStatus("too_short");
      } else {
        setStatus("error");
      }
    });
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 px-6 py-8 text-center">
        <p className="mb-2 text-lg font-semibold text-foreground">
          ✦ {t.successTitle}
        </p>
        <p className="text-foreground/70">{t.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Honeypot — hidden from real users, traps bots */}
      <div aria-hidden="true" style={{ display: "none" }}>
        <input
          type="text"
          name="website"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <textarea
        value={story}
        onChange={(e) => setStory(e.target.value)}
        placeholder={t.placeholder}
        rows={8}
        required
        disabled={isPending}
        className="w-full resize-none rounded-xl border border-brand-gray bg-background px-4 py-3 text-base text-foreground placeholder:text-foreground/40 focus:border-brand-yellow focus:outline-none focus:ring-2 focus:ring-brand-yellow/30 disabled:opacity-60"
      />

      {status === "too_short" && (
        <p className="text-sm text-red-500">{t.minLength}</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-500">{t.errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={isPending || story.trim().length === 0}
        className="w-full rounded-xl bg-brand-yellow px-6 py-3 font-semibold text-brand-navy transition hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? t.submitting : t.submit}
      </button>

      <p className="text-center text-xs text-foreground/40">{t.footer}</p>
    </form>
  );
}
