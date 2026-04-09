import { Lead, LeadStatus, LeadPriority } from "@prisma/client";
import { UpdateLeadData } from "@/lib/server/leads/write/updateLead";

// ============================================================================
// Lead Change Tracking Helpers
// Used to generate human-readable change descriptions for activity logs
// ============================================================================

/**
 * Formats a field change message
 * @example formatFieldChange("status", "NEW", "CONTACTED") => "status from 'NEW' to 'CONTACTED'"
 */
export function formatFieldChange(
  fieldName: string,
  oldValue: string | null | undefined,
  newValue: string | null | undefined,
): string {
  const oldDisplay = oldValue || "none";
  const newDisplay = newValue || "none";
  return `${fieldName} from "${oldDisplay}" -> "${newDisplay}"`;
}

/**
 * Tracks changes between current lead and update data
 * Returns array of change descriptions for activity logging
 */
export function trackLeadChanges(
  currentLead: Lead,
  updates: UpdateLeadData,
): { field: string; change: string; from: any; to: any }[] {
  const metadata: { field: string; change: string; from: any; to: any }[] = [];

  if (updates.name && updates.name !== currentLead.name) {
    metadata.push({
      field: "name",
      change: formatFieldChange("name", currentLead.name, updates.name),
      from: currentLead.name,
      to: updates.name,
    });
  }
  if (updates.email && updates.email !== currentLead.email) {
    metadata.push({
      field: "email",
      change: formatFieldChange("email", currentLead.email, updates.email),
      from: currentLead.email,
      to: updates.email,
    });
  }
  if (updates.source !== undefined && updates.source !== currentLead.source) {
    metadata.push({
      field: "source",
      change: formatFieldChange("source", currentLead.source, updates.source),
      from: currentLead.source,
      to: updates.source,
    });
  }
  if (updates.status && updates.status !== currentLead.status) {
    metadata.push({
      field: "status",
      change: formatFieldChange("status", currentLead.status, updates.status),
      from: currentLead.status,
      to: updates.status,
    });
  }
  if (updates.priority && updates.priority !== currentLead.priority) {
    metadata.push({
      field: "priority",
      change: formatFieldChange(
        "priority",
        currentLead.priority,
        updates.priority,
      ),
      from: currentLead.priority,
      to: updates.priority,
    });
  }

  return metadata;
}

/**
 * Formats a status change specifically
 * Used by updateLeadStatus for consistent messaging
 */
export function formatStatusChange(
  oldStatus: LeadStatus,
  newStatus: LeadStatus,
): { change: string; from: LeadStatus; to: LeadStatus } {
  // return formatFieldChange("status", oldStatus, newStatus);
  return {
    change: formatFieldChange("status", oldStatus, newStatus),
    from: oldStatus,
    to: newStatus,
  };
}
/**
 * Formats a priority change specifically
 * Used by updateLeadPriority for consistent messaging
 */
export function formatPriorityChange(
  oldPriority: LeadPriority,
  newPriority: LeadPriority,
): { change: string; from: LeadPriority; to: LeadPriority } {
  return {
    change: formatFieldChange("priority", oldPriority, newPriority),
    from: oldPriority,
    to: newPriority,
  };
}
