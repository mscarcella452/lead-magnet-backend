import { UserRole, LeadStatus, LeadPriority } from "@prisma/client";

// ============================================================================
// Shared Types
// ============================================================================

export interface OptionConfig {
  label: string;
  variant: "info" | "warning" | "purple" | "success" | "destructive" | "brand" | "primary";
}

// ============================================================================
// Role Config
// ============================================================================

export type AssignableRole = Exclude<UserRole, "OWNER" | "DEV">;

export const ASSIGNABLE_ROLE_CONFIG: Record<AssignableRole, OptionConfig> = {
  ADMIN: { label: "Admin", variant: "info" },
  MEMBER: { label: "Member", variant: "primary" },
};

export const ROLE_CONFIG: Record<UserRole, OptionConfig> = {
  OWNER: { label: "Owner", variant: "brand" },
  ADMIN: { label: "Admin", variant: "info" },
  DEV: { label: "Developer", variant: "success" },
  MEMBER: { label: "Member", variant: "primary" },
};

export const ROLE_OPTIONS = [
  "OWNER",
  "ADMIN",
  "DEV",
  "MEMBER",
] satisfies UserRole[];

export const ASSIGNABLE_ROLE_OPTIONS = [
  "ADMIN",
  "MEMBER",
] satisfies AssignableRole[];

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

// ============================================================================
// Source Config
// ============================================================================

// Source is dynamic and doesn't have a fixed enum like Status/Priority
// This is a placeholder for future source-specific configuration
export const SOURCE_CONFIG: Record<string, OptionConfig> = {};

// ============================================================================
// Invite Status Config
// ============================================================================

export type InviteStatusKey = "ACCEPTED" | "PENDING" | "EXPIRED";

export const INVITE_STATUS_CONFIG: Record<InviteStatusKey, OptionConfig> = {
  ACCEPTED: { label: "Accepted", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  EXPIRED: { label: "Expired", variant: "destructive" },
};

export const INVITE_STATUS_OPTIONS = [
  "ACCEPTED",
  "PENDING",
  "EXPIRED",
] satisfies InviteStatusKey[];
