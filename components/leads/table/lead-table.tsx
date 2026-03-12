// ============================================================================
// Lead Table Component
// ============================================================================

import { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/layout/table";
import { cn } from "@/lib/utils/classnames";
import {
  CheckboxHeader,
  EmptyState,
  LeadTableRow,
  SortableHeader,
} from "@/components/leads/table/components";
import { TABLE_COLUMNS } from "@/components/leads/table/lib/constants";
import type { LeadTableProps } from "@/components/leads/table/lib/types";
import { SelectionBar } from "@/components/dashboard/selection-bar";

export function LeadTable({
  leads,
  className,
  onSort,
  sortBy,
  sortOrder,
  refetch,
}: LeadTableProps) {
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  // ── Selection handlers ──────────────────────────────────────────────────

  const handleToggleLead = useCallback((leadId: string) => {
    setSelectedLeads((prev) => {
      const next = new Set(prev);
      next[next.has(leadId) ? "delete" : "add"](leadId);
      return next;
    });
  }, []);

  const handleToggleAll = useCallback(() => {
    setSelectedLeads((prev) =>
      prev.size === 0 ? new Set(leads.map((lead) => lead.id)) : new Set(),
    );
  }, [leads]);

  // ── Derived selection state ─────────────────────────────────────────────

  const allSelected = leads.length > 0 && selectedLeads.size === leads.length;
  const someSelected =
    selectedLeads.size > 0 && selectedLeads.size < leads.length;

  // ── Empty state ─────────────────────────────────────────────────────────

  if (leads.length === 0) {
    return <EmptyState />;
  }

  // ── Table ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* <div
        className={cn(
          "rounded-md bg-panel shadow-xs  overflow-hidden",
          className,
        )}
        role="region"
        aria-label="Leads table"
      > */}
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <CheckboxHeader
              checked={allSelected}
              indeterminate={someSelected}
              onToggle={handleToggleAll}
            />
            {TABLE_COLUMNS.map((column) => (
              <SortableHeader
                key={column.key}
                field={column.key}
                label={column.label}
                onSort={onSort}
                sortBy={sortBy}
                sortOrder={sortOrder}
              />
            ))}
            <TableHead
              scope="col"
              className="text-right text-sm text-foreground"
            >
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <LeadTableRow
              key={lead.id}
              lead={lead}
              isSelected={selectedLeads.has(lead.id)}
              onToggle={handleToggleLead}
              refetch={refetch}
            />
          ))}
        </TableBody>
      </Table>
      {/* </div> */}

      <SelectionBar
        selectedLeads={selectedLeads}
        onClear={() => setSelectedLeads(new Set())}
        refetch={refetch}
      />
    </>
  );
}
