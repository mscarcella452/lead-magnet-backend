import { Lead } from "@/types";
import { LeadStatus } from "@prisma/client";
import { SortDirection } from "@/components/leads/table/lib/types";
import type { SortField } from "@/lib/server/read/getTableLeads";

// ============================================================================
// Status Ordering
// ============================================================================

const STATUS_ORDER = Object.values(LeadStatus);

// ============================================================================
// Sort Helpers
// ============================================================================

/**
 * Safely extracts a value for comparison, handling null/undefined
 */
function getSafeValue<T>(value: T | null | undefined): string | T {
  return value === null || value === undefined ? "" : value;
}

/**
 * Compares two date values
 */
function compareDates(a: Date, b: Date, direction: SortDirection): number {
  const aTime = new Date(a).getTime();
  const bTime = new Date(b).getTime();
  return direction === "asc" ? aTime - bTime : bTime - aTime;
}

/**
 * Compares two status values using enum order
 */
function compareStatus(
  a: LeadStatus,
  b: LeadStatus,
  direction: SortDirection,
): number {
  const aIndex = STATUS_ORDER.indexOf(a);
  const bIndex = STATUS_ORDER.indexOf(b);
  return direction === "asc" ? aIndex - bIndex : bIndex - aIndex;
}

/**
 * Compares two string values
 */
function compareStrings(
  a: string,
  b: string,
  direction: SortDirection,
): number {
  if (direction === "asc") {
    return a > b ? 1 : -1;
  }
  return a < b ? 1 : -1;
}

// ============================================================================
// Main Sort Function
// ============================================================================

/**
 * Sorts an array of leads by the specified field and direction
 */
export function sortLeads(
  leads: Lead[],
  sortField: SortField,
  sortDirection: SortDirection,
): Lead[] {
  return [...leads].sort((a, b) => {
    const aValue = a[sortField as keyof Lead];
    const bValue = b[sortField as keyof Lead];

    const aVal = getSafeValue(aValue);
    const bVal = getSafeValue(bValue);

    // Handle date sorting
    if (sortField === "createdAt") {
      return compareDates(aVal as Date, bVal as Date, sortDirection);
    }

    // Handle status sorting
    if (sortField === "status") {
      return compareStatus(
        aVal as LeadStatus,
        bVal as LeadStatus,
        sortDirection,
      );
    }

    // Handle string/enum sorting
    return compareStrings(String(aVal), String(bVal), sortDirection);
  });
}

// ============================================================================
// Sort Direction Toggle
// ============================================================================

/**
 * Toggles sort direction or sets new sort field
 */
export function getNextSortState(
  currentField: SortField,
  currentDirection: SortDirection,
  newField: SortField,
): { field: SortField; direction: SortDirection } {
  if (currentField === newField) {
    return {
      field: currentField,
      direction: currentDirection === "asc" ? "desc" : "asc",
    };
  }
  return {
    field: newField,
    direction: "asc",
  };
}
