"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { LeadTableRow } from "@/types";
import { Lead } from "@/types";
import { formatDate } from "@/lib/utils/dates";
import { StatusDropdown } from "@/components/status/status-dropdown";
import { DIALOG_TYPES, ALERT_DIALOG_TYPES } from "@/types/ui/dialog";
import { ArrowUpDown, Eye, Pencil, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/controls";
import { Badge } from "@/components/ui/feedback/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { DialogTrigger } from "@/components/ui/feedback/dialog";
import { AlertDialogTrigger } from "@/components/ui/feedback/alert-dialog";
import { cn } from "@/lib/utils/classnames";
import { sortLeads } from "@/lib/utils/lead-table";
import { Checkbox } from "@/components/ui/controls/checkbox";
import { LeadStatus } from "@prisma/client";
import { updateLeadStatusAction } from "@/lib/server/actions/write/updateLeadStatusAction";
import { toast } from "sonner";
import { SortField } from "@/lib/server/read/getTableLeads";
import { getLeadWithRelationsAction } from "@/lib/server/actions/read/getLeadWithRelationsAction";
import { leadWithRelationsCache } from "@/lib/cache/lead-with-relations-cache";

// ============================================================================
// Types
// ============================================================================

interface LeadTableProps {
  leads: LeadTableRow[];
  className?: string;
  onSort?: (field: SortField) => void;
  sortBy?: SortField;
  sortOrder?: "asc" | "desc";
}

interface SelectionState {
  selectedLeads: Set<string>;
}

export type SortDirection = "asc" | "desc";

// ============================================================================
// Table Configuration
// ============================================================================

const TABLE_COLUMNS = [
  // { key: "email" as SortField, label: "Email" },
  { key: "name" as SortField, label: "Name" },
  { key: "source" as SortField, label: "Source" },
  { key: "status" as SortField, label: "Status" },
  { key: "createdAt" as SortField, label: "Created" },
] as const;

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState() {
  return (
    <div className="text-center py-12 text-muted-foreground">
      No leads yet. Waiting for submissions...
    </div>
  );
}

// ============================================================================
// Checkbox Header Component
// ============================================================================

interface CheckboxHeaderProps {
  checked: boolean;
  indeterminate: boolean;
  onToggle: () => void;
}

function CheckboxHeader({
  checked,
  indeterminate,
  onToggle,
}: CheckboxHeaderProps) {
  return (
    <TableHead className="w-12">
      <Checkbox
        checked={indeterminate ? "indeterminate" : checked}
        onCheckedChange={onToggle}
        aria-label="Select all leads"
      />
    </TableHead>
  );
}

// ============================================================================
// Sortable Header Component
// ============================================================================

interface SortableHeaderProps {
  field: SortField;
  label: string;
  onSort?: (field: SortField) => void;
  sortBy?: SortField;
  sortOrder?: "asc" | "desc";
}

function SortableHeader({
  field,
  label,
  onSort,
  sortBy,
  sortOrder,
}: SortableHeaderProps) {
  const isActive = sortBy === field;

  return (
    <TableHead>
      <Button
        intent="ghost"
        size="sm"
        onClick={() => onSort?.(field)}
        className={cn(isActive && "text-primary")}
      >
        {label}
        <ArrowUpDown
          className={cn(
            "transition-transform",
            isActive && sortOrder === "asc" && "rotate-180",
          )}
        />
      </Button>
    </TableHead>
  );
}

// ============================================================================
// Actions Menu Component
// ============================================================================

interface ActionsMenuProps {
  lead: LeadTableRow;
}

function ActionsMenu({ lead }: ActionsMenuProps) {
  const prefetchLead = async () => {
    // Skip if already cached
    if (leadWithRelationsCache.has(lead.id)) return;

    const result = await getLeadWithRelationsAction(lead.id);
    if (result.success) {
      leadWithRelationsCache.set(lead.id, {
        notes: result.data.notes,
        activities: result.data.activities,
      });
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => open && prefetchLead()}>
      <DropdownMenuTrigger asChild>
        <Button intent="ghost" size="sm" mode="iconOnly" className="text-sm">
          <MoreHorizontal />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DialogTrigger
            asChild
            dialogType={DIALOG_TYPES.VIEW_LEAD}
            payload={{ leadId: lead.id }}
          >
            <DropdownMenuItem>
              <Eye />
              View
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogTrigger
            asChild
            dialogType={DIALOG_TYPES.EDIT_LEAD}
            payload={{ leadId: lead.id }}
          >
            <DropdownMenuItem>
              <Pencil />
              Edit
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <AlertDialogTrigger
            asChild
            dialogType={ALERT_DIALOG_TYPES.DELETE_LEAD}
            payload={{ leadId: [lead.id] }}
          >
            <DropdownMenuItem variant="destructive">
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ============================================================================
// Table Row Component
// ============================================================================

interface LeadTableRowComponentProps {
  lead: LeadTableRow;
  isSelected: boolean;
  onToggle: (leadId: string) => void;
}

function LeadTableRowComponent({
  lead,
  isSelected,
  onToggle,
}: LeadTableRowComponentProps) {
  return (
    <TableRow key={lead.id} data-state={isSelected ? "selected" : undefined}>
      <TableCell className="w-12">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onToggle(lead.id)}
          aria-label={`Select ${lead.email}`}
        />
      </TableCell>
      {/* <TableCell className="font-medium">{lead.email}</TableCell> */}
      <TableCell className="text-sm">{lead.name || "—"}</TableCell>
      <TableCell>
        {lead.source ? (
          <Badge variant="primary" intent="soft" size="sm">
            {lead.source}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-sm">—</span>
        )}
      </TableCell>
      <StatusTableCell leadId={lead.id} status={lead.status} />
      <TableCell className="text-xs text-subtle-foreground">
        {formatDate(lead.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <ActionsMenu lead={lead} />
      </TableCell>
    </TableRow>
  );
}

const StatusTableCell = ({
  leadId,
  status,
}: {
  leadId: string;
  status: LeadStatus;
}) => {
  const onStatusChange = async (newStatus: LeadStatus) => {
    if (newStatus === status) return;

    const previousStatus = status;

    const result = await updateLeadStatusAction({
      leadId,
      newStatus,
      performedBy: "You",
    });

    if (result.success) {
      const successMessage = `Lead Status updated from ${previousStatus} to ${newStatus}`;
      toast.success(successMessage);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <TableCell>
      <StatusDropdown currentStatus={status} onStatusChange={onStatusChange} />
    </TableCell>
  );
};

// ============================================================================
// Main Lead Table Component
// ============================================================================

export function LeadTable({
  leads,
  className,
  onSort,
  sortBy,
  sortOrder,
}: LeadTableProps) {
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  // Handle checkbox selection
  const handleToggleLead = (leadId: string) => {
    setSelectedLeads((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(leadId)) {
        newSet.delete(leadId);
      } else {
        newSet.add(leadId);
      }
      return newSet;
    });
  };

  const handleToggleAll = () => {
    if (selectedLeads.size === 0) {
      // Select all
      setSelectedLeads(new Set(leads.map((lead) => lead.id)));
    } else {
      // Deselect all
      setSelectedLeads(new Set());
    }
  };

  // Calculate checkbox states
  const allSelected = leads.length > 0 && selectedLeads.size === leads.length;
  const someSelected =
    selectedLeads.size > 0 && selectedLeads.size < leads.length;

  // Early return for empty state
  if (leads.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className={cn("rounded-md border overflow-hidden", className)}>
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
            <TableHead className="text-right text-sm text-foreground">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <LeadTableRowComponent
              key={lead.id}
              lead={lead}
              isSelected={selectedLeads.has(lead.id)}
              onToggle={handleToggleLead}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
