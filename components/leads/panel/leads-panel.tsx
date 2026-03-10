"use client";

import { Container } from "@/components/ui/layout/containers";
import { LeadTable, LeadTableHeader } from "@/components/leads/table";
import { LeadPagination } from "@/components/leads/pagination/lead-pagination";
import type { InitialLeadData } from "@/components/leads/panel/lib/types";
import { useLeadsState } from "@/components/leads/panel/lib/useLeadsState";
import { SelectionBar } from "@/components/dashboard/selection-bar";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils/classnames";

interface LeadsPanelProps {
  initialLeadData: InitialLeadData;
}

export function LeadsPanel({ initialLeadData }: LeadsPanelProps) {
  const {
    state,
    totalPages,
    isLoading,
    handleSort,
    handlePageChange,
    refetch,
  } = useLeadsState(initialLeadData);
  const [count, setCount] = useState(3);

  const handleAdd = () => setCount(1);

  return (
    <Container
      spacing="block"
      width="full"
      aria-busy={isLoading}
      aria-label="Leads panel"
    >
      <button onClick={handleAdd}>Add</button>
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
