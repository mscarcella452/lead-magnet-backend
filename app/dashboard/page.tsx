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
import { ExportAllButton } from "@/components/leads/export/export-all-button";

// ============================================================================
// Dashboard Page
// ============================================================================

export default async function DashboardPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <Inset as="main" variant="content">
      <Container as="section" spacing="section" width="constrained">
        <Container spacing="content" position="start" width="full">
          <DashboardHeader
            header="Dashboard"
            subheader="Track and manage leads from your fitness campaigns"
            action={<ExportAllButton />}
          />
          <ErrorBoundary fallbackRender={StatsCardsError}>
            <Suspense fallback={<StatsCardsSkeleton />}>
              <StatsSection />
            </Suspense>
          </ErrorBoundary>
        </Container>
        <ErrorBoundary fallbackRender={LeadsPanelError}>
          <Suspense fallback={<LeadsPanelSkeleton />}>
            <LeadsSection searchParams={resolvedSearchParams} />
          </Suspense>
        </ErrorBoundary>
      </Container>
    </Inset>
  );
}
