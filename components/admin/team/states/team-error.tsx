"use client";
import { FallbackProps } from "react-error-boundary";
import { SectionError } from "@/components/ui/feedback/section-error";

// ============================================================================
// TeamError
// ============================================================================

export function TeamError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <SectionError
      error={error}
      resetErrorBoundary={resetErrorBoundary}
      errorMessage={{
        title: "Failed to load team members",
        description: "We couldn't load your team members. Please try again.",
      }}
    />
  );
}
