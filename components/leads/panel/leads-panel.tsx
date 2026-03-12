"use client";

import { Container } from "@/components/ui/layout/containers";
import { LeadTable, LeadTableHeader } from "@/components/leads/table";
import { LeadPagination } from "@/components/leads/pagination/lead-pagination";
import type { InitialLeadData } from "@/components/leads/panel/lib/types";
import { useLeadsState } from "@/components/leads/panel/lib/useLeadsState";

// ============================================================================
// types
// ============================================================================

interface LeadsPanelProps {
  initialLeadData: InitialLeadData;
}

// ============================================================================
// LeadsPanel
// ============================================================================

export function LeadsPanel({ initialLeadData }: LeadsPanelProps) {
  const {
    state,
    totalPages,
    isLoading,
    handleSort,
    handlePageChange,
    refetch,
  } = useLeadsState(initialLeadData);

  return (
    <Container
      spacing="block"
      width="full"
      aria-busy={isLoading}
      aria-label="Leads panel"
    >
      <LeadTableHeader leads={state.leads} />
      <LeadTable
        leads={state.leads}
        onSort={handleSort}
        sortBy={state.sortBy}
        sortOrder={state.sortOrder}
        refetch={refetch}
      />
      <LeadPagination
        currentPage={state.page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </Container>
  );
}
