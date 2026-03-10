import { LeadStatus, LeadPriority } from "@prisma/client";

// ============================================================================
// Option Config Type
// ============================================================================

export interface OptionConfig {
  label: string;
  variant: "info" | "warning" | "purple" | "success" | "destructive";
}

// ============================================================================
// Status Config
// ============================================================================

export const STATUS_CONFIG: Record<LeadStatus, OptionConfig> = {
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

export const PRIORITY_CONFIG: Record<LeadPriority, OptionConfig> = {
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
