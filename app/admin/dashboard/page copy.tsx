// ============================================================================
// Dashboard Page
// ============================================================================

import { redirect } from "next/navigation";
import { checkAuth } from "@/lib/auth";
import { Inset, Container } from "@/components/ui/layout/containers";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCards } from "@/components/dashboard/components/stats-cards";
import { LeadsPanel } from "@/components/leads/leads-panel";
import { getTableLeads } from "@/lib/server/read/getTableLeads";
import { getDashboardStats } from "@/lib/server/read/getDashboardStats";
import type { SortField, SortOrder } from "@/lib/server/read/getTableLeads";

// ============================================================================
// Types
// ============================================================================

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

// ============================================================================
// Helpers
// ============================================================================

function parseSearchParams(params: Awaited<PageProps["searchParams"]>) {
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const limit = Math.max(1, parseInt(params.limit ?? "10"));
  return {
    page,
    limit,
    offset: (page - 1) * limit,
    sortBy: (params.sortBy as SortField) ?? "createdAt",
    sortOrder: (params.sortOrder as SortOrder) ?? "desc",
  };
}

// ============================================================================
// Page
// ============================================================================

export default async function DashboardPage({ searchParams }: PageProps) {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) redirect("/admin/login");

  const { page, ...tableParams } = parseSearchParams(await searchParams);

  // Parallel fetches — don't await sequentially
  const [leadsResult, statsResult] = await Promise.all([
    getTableLeads(tableParams),
    getDashboardStats(),
  ]);

  return (
    <Inset as="main" variant="content">
      <Container spacing="section" width="constrained">
        <Container spacing="content" position="start" width="full">
          <DashboardHeader />
          <StatsCards
            stats={statsResult.success ? statsResult.data : undefined}
            error={statsResult.success ? undefined : "Stats unavailable"}
          />
        </Container>

        <LeadsPanel
          {...(leadsResult.success
            ? {
                initialLeadData: {
                  leads: leadsResult.data.leads,
                  total: leadsResult.data.total,
                  page,
                  ...tableParams,
                },
              }
            : { error: "Could not load leads" })}
        />
      </Container>
    </Inset>
  );
}
