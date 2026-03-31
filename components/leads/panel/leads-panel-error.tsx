"use client";

import { FallbackProps } from "react-error-boundary";
import { SectionError } from "@/components/ui/feedback/section-error";

export function LeadsPanelError({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <SectionError
      error={error}
      resetErrorBoundary={resetErrorBoundary}
      errorMessage={{
        title: "Leads unavailable",
        description:
          "We couldn't load your leads. Check your connection and try again.",
      }}
    />
  );
}
