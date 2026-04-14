"use client";
import { FallbackProps } from "react-error-boundary";
import { SectionError } from "@/components/ui/feedback/section-error";

// ============================================================================
// AccountError
// ============================================================================

export function AccountError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <SectionError
      error={error}
      resetErrorBoundary={resetErrorBoundary}
      errorMessage={{
        title: "Failed to load account settings",
        description:
          "We couldn't load your account settings. Please try again.",
      }}
    />
  );
}
