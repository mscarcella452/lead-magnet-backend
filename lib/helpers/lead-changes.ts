import { Lead, LeadStatus } from "@prisma/client";

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
  updates: {
    name?: string;
    email?: string;
    source?: string;
    status?: LeadStatus;
  },
): string[] {
  const changes: string[] = [];

  if (updates.name && updates.name !== currentLead.name) {
    changes.push(formatFieldChange("name", currentLead.name, updates.name));
  }

  if (updates.email && updates.email !== currentLead.email) {
    changes.push(formatFieldChange("email", currentLead.email, updates.email));
  }

  if (updates.source !== undefined && updates.source !== currentLead.source) {
    changes.push(
      formatFieldChange("source", currentLead.source, updates.source),
    );
  }

  if (updates.status && updates.status !== currentLead.status) {
    changes.push(
      formatFieldChange("status", currentLead.status, updates.status),
    );
  }

  return changes;
}

/**
 * Formats a status change specifically
 * Used by updateLeadStatus for consistent messaging
 */
export function formatStatusChange(
  oldStatus: LeadStatus,
  newStatus: LeadStatus,
): string {
  return formatFieldChange("status", oldStatus, newStatus);
}
