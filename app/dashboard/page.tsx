import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ui/feedback/error-boundary";
import { Inset, Container } from "@/components/ui/layout/containers";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  StatsCardsError,
  StatsCardsSkeleton,
} from "@/components/dashboard/stats-cards";
import { StatsSection } from "@/components/dashboard/stats-section";
import { LeadsSection } from "@/components/dashboard/leads-section";
import { LeadsPanelSkeleton, LeadsPanelError } from "@/components/leads/panel";
import type { PageProps } from "@/components/dashboard/lib/types";

// ============================================================================
// Dashboard Page
// ============================================================================

export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <Inset as="main" variant="content">
      <Container spacing="section" width="constrained">
        <Container spacing="content" position="start" width="full">
          <DashboardHeader />
          <ErrorBoundary
            fallback={<StatsCardsError message="Stats unavailable" />}
          >
            <Suspense fallback={<StatsCardsSkeleton />}>
              <StatsSection />
            </Suspense>
          </ErrorBoundary>
        </Container>
        <ErrorBoundary
          fallback={<LeadsPanelError message="Failed to load leads." />}
        >
          <Suspense fallback={<LeadsPanelSkeleton />}>
            <LeadsSection searchParams={resolvedSearchParams} />
          </Suspense>
        </ErrorBoundary>
      </Container>
    </Inset>
  );
}
