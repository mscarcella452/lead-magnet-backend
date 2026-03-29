"use client";
import { FallbackProps } from "react-error-boundary";
import { SectionError } from "@/components/ui/feedback/section-error";

// ============================================================================
// StatsCardsError
// ============================================================================

export function StatsCardsError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <SectionError
      error={error}
      resetErrorBoundary={resetErrorBoundary}
      fallbackErrorMessage="Stats unavailable"
      description="We couldn't load your dashboard statistics. Please try again."
    />
  );
}
