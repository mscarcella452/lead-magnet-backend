import { LeadStatus } from "@prisma/client";

// ============================================================================
// Status Config
// ============================================================================

export const STATUS_CONFIG: Record<
  LeadStatus,
  {
    label: string;
    variant: "info" | "warning" | "purple" | "success" | "destructive";
  }
> = {
  NEW: { label: "New", variant: "info" },
  CONTACTED: { label: "Contacted", variant: "warning" },
  QUALIFIED: { label: "Qualified", variant: "purple" },
  CONVERTED: { label: "Converted", variant: "success" },
  LOST: { label: "Lost", variant: "destructive" },
};

export const STATUS_OPTIONS = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "CONVERTED",
  "LOST",
] satisfies LeadStatus[];

// ============================================================================
// Source Config
// ============================================================================
