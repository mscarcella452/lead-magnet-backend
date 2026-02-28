"use client";

import { Container } from "@/components/ui/layout/containers";
import { LeadTableHeader } from "./lead-table-header";
import { LeadTable } from "./LeadTable";
import { LeadTableRow } from "@/types/lead";
import { useState, useTransition } from "react";
import { getTableLeadsAction } from "@/lib/server/actions/read/getTableLeadsAction";
import { toast } from "sonner";
import { LeadPagination } from "./lead-pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { SortField, SortOrder } from "@/lib/server/read/getTableLeads";

type LeadsTableSectionProps = {
  initialLeadData: {
    initialLeads: LeadTableRow[];
    initialLimit: number;
    initialPage: number;
    initialSortBy?: SortField;
    initialSortOrder: SortOrder;
    total: number;
  };
};

const LeadsTableSection = ({ initialLeadData }: LeadsTableSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState(initialLeadData.initialLeads);
  const [total, setTotal] = useState(initialLeadData.total);
  const [page, setPage] = useState(initialLeadData.initialPage);
  const [limit, setLimit] = useState(initialLeadData.initialLimit);
  const [sortBy, setSortBy] = useState<SortField | undefined>(
    initialLeadData.initialSortBy,
  );
  const [sortOrder, setSortOrder] = useState<SortOrder>(
    initialLeadData.initialSortOrder,
  );
  const [isLoading, startTransition] = useTransition();

  const totalPages = Math.ceil(total / limit);

  const handleSort = (field: SortField) => {
    if (isLoading) return;

    // Toggle sort order if clicking same field, otherwise default to desc
    const newSortOrder =
      field === sortBy && sortOrder === "desc" ? "asc" : "desc";

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", field);
    params.set("sortOrder", newSortOrder);
    params.set("page", "1"); // Reset to page 1 when sorting
    router.replace(`?${params.toString()}`, { scroll: false });

    startTransition(async () => {
      const result = await getTableLeadsAction({
        limit,
        offset: 0, // Reset to first page
        sortBy: field,
        sortOrder: newSortOrder,
      });

      if (result.success) {
        setLeads(result.data.leads);
        setTotal(result.data.total);
        setPage(1);
        setSortBy(field);
        setSortOrder(newSortOrder);
      } else {
        toast.error(result.error);
      }
    });
  };

  const handlePageChange = (nextPage: number) => {
    if (isLoading || nextPage < 1 || nextPage > totalPages) return;

    // Update URL
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", nextPage.toString());
    router.replace(`?${params.toString()}`, { scroll: false });

    startTransition(async () => {
      const offset = (nextPage - 1) * limit;
      const result = await getTableLeadsAction({
        limit,
        offset,
        sortBy,
        sortOrder,
      });

      if (result.success) {
        setLeads(result.data.leads);
        setTotal(result.data.total);
        setPage(nextPage);
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Container spacing="block" width="full">
      <LeadTableHeader leads={leads} />
      <LeadTable
        leads={leads}
        onSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
      />
      <LeadPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </Container>
  );
};

export { LeadsTableSection };

// const result = await getLeads();

// if (result.success) {
//   // TypeScript knows result.data exists
//   setLeads(result.data);
// } else {
//   // TypeScript knows result.error exists
//   toast.error(result.error);
// }
