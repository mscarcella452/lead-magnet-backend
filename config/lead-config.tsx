import { LeadStatus, LeadPriority } from "@prisma/client";

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
// Priority Config
// ============================================================================

export const PRIORITY_CONFIG: Record<
  LeadPriority,
  {
    label: string;
    variant: "info" | "warning" | "success" | "destructive";
  }
> = {
  LOW: { label: "Low", variant: "info" },
  MEDIUM: { label: "Medium", variant: "success" },
  HIGH: { label: "High", variant: "warning" },
  URGENT: { label: "Urgent", variant: "destructive" },
};

export const PRIORITY_OPTIONS = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
] satisfies LeadPriority[];

// ============================================================================
// Source Config
// ============================================================================
