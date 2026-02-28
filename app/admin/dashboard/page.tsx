import { redirect } from "next/navigation";

import { checkAuth } from "@/lib/auth";
import { Inset, Container } from "@/components/ui/layout/containers";
import { DashboardHeader } from "./dashboard-header";
import { LeadsTableSection } from "@/app/admin/dashboard/leads-table-section";
import { getLeadsAction } from "@/lib/server/actions/read/getLeadsAction";
import { SortField, SortOrder } from "@/lib/server/read/getLeads";
import { getDashboardStatsAction } from "@/lib/server/actions/read/getDashboardStatsAction";
import { StatsCards } from "@/app/admin/dashboard/StatsCards";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: PageProps) {
  // Check authentication
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  const params = await searchParams;

  const page = parseInt(params.page ?? "1");
  const limit = parseInt(params.limit ?? "10");
  const offset = (page - 1) * limit;
  const sortBy = (params.sortBy as SortField) ?? "createdAt";
  const sortOrder = (params.sortOrder as SortOrder) ?? "desc";

  const leadsResult = await getLeadsAction({
    limit,
    offset,
    sortBy,
    sortOrder,
  });

  const stats = await getDashboardStatsAction();

  if (!leadsResult.success) {
    return <div>Error loading leads</div>;
  }

  if (!stats.success) {
    return <div>Error loading stats</div>;
  }

  return (
    <>
      <Inset as="main" variant="content">
        <Container spacing="section" width="constrained">
          <Container spacing="content" position="start" width="full">
            <DashboardHeader />

            <StatsCards stats={stats.data} />
          </Container>
          <LeadsTableSection
            initialLeadData={{
              initialLimit: limit,
              initialPage: page,
              initialSortBy: sortBy,
              initialSortOrder: sortOrder,
              total: leadsResult.data.total,
              initialLeads: leadsResult.data.leads,
            }}
          />
        </Container>
      </Inset>
    </>
  );
}
