import { Lead } from "@prisma/client";
import { formatDate } from "@/lib/utils/dates";
// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

type ExportableLeadField = Extract<
  keyof Lead,
  "email" | "name" | "source" | "status" | "createdAt" | "metadata"
>;

const FIELD_TO_HEADER: Record<ExportableLeadField, string> = {
  email: "Email",
  name: "Name",
  source: "Source",
  status: "Status",
  createdAt: "Created At",
  metadata: "Metadata",
};

const EXPORT_FIELDS: ExportableLeadField[] = [
  "email",
  "name",
  "source",
  "status",
  "createdAt",
  "metadata",
];

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
};

// ============================================================================
// formatLeadFieldForCSV(lead: Lead, field: ExportableLeadField): string
// Formats a single lead field for CSV export
// Handles type-specific formatting (dates, objects, null/undefined)
// ============================================================================

function formatLeadFieldForCSV(lead: Lead, field: ExportableLeadField): string {
  const value = lead[field];

  // Handle null/undefined - Empty string, will become "" in CSV
  if (value === null || value === undefined) return "";

  // Format dates for readability
  if (field === "createdAt" && value instanceof Date) {
    return formatDate(value, DATE_FORMAT_OPTIONS);
  }

  // Escape metadata JSON (replace quotes with double quotes for CSV spec)
  if (field === "metadata" && typeof value === "object") {
    return JSON.stringify(value).replace(/"/g, '""');
  }

  // Default: convert to string
  return String(value);
}

// ============================================================================
// generateLeadsCSV(leads: Lead[]): string
// Generates a CSV string from an array of leads
// Returns headers-only CSV if leads array is empty
// Tied to Prisma Lead schema for type safety
// ============================================================================

export function generateLeadsCSV(leads: Lead[]): string {
  // Generate headers from field mappings
  const headers = EXPORT_FIELDS.map((field) => FIELD_TO_HEADER[field]).join(
    ",",
  );

  // Return headers-only for empty array (valid CSV)
  if (leads.length === 0) return headers;

  // Generate CSV rows
  const rows = leads.map((lead) =>
    EXPORT_FIELDS.map(
      (field) => `"${formatLeadFieldForCSV(lead, field)}"`,
    ).join(","),
  );

  // Combine headers and rows
  return [headers, ...rows].join("\n");
}

// ============================================================================
// downloadCSV(csvContent: string, filename: string): void
// Triggers a browser download for CSV content
// ============================================================================

export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
