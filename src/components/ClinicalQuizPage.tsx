"use client";

import { useState } from "react";
import type { QuizDefinition } from "@/lib/quiz-engine";
import { DisclaimerGate } from "@/components/DisclaimerGate";
import { QuizRunner } from "@/components/QuizRunner";

export function ClinicalQuizPage({ definition }: { definition: QuizDefinition }) {
  const [stage, setStage] = useState<"disclaimer" | "quiz">("disclaimer");

  if (stage === "disclaimer") {
    return (
      <DisclaimerGate namespace={definition.namespace} onAcknowledge={() => setStage("quiz")} />
    );
  }

  return <QuizRunner definition={definition} />;
}
