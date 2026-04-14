import "server-only";
import { Lead, ActivityType } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  trackLeadChanges,
  formatStatusChange,
  formatPriorityChange,
} from "@/lib/leads/helpers/changes";
import { getCurrentUser } from "@/lib/server/auth/read/getCurrentUser";
import { LeadMetadataUpdate } from "@/types/leads/fields";

// ============================================================
// Types
// ============================================================

export type UpdateLeadData = Partial<
  Pick<Lead, "name" | "email" | "source" | "status" | "priority" | "metadata">
>;

// ============================================================
// updateLead
// ============================================================

/**
 * Updates a lead and logs activity for each changed field.
 * Requires an authenticated user — performedBy is derived from session.
 */
export async function updateLead(
  id: string,
  data: UpdateLeadData,
): Promise<Lead> {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  const currentLead = await prisma.lead.findUnique({ where: { id } });
  if (!currentLead) throw new Error("Lead not found.");

  const changes = trackLeadChanges(currentLead, data);

  const statusChange = changes.find((c) => c.field === "status");
  const priorityChange = changes.find((c) => c.field === "priority");
  const otherChanges = changes.filter(
    (c) => c.field !== "status" && c.field !== "priority",
  );

  const [updatedLead] = await prisma.$transaction([
    prisma.lead.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.source !== undefined && { source: data.source }),
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.metadata && { metadata: data.metadata as LeadMetadataUpdate }),
      },
    }),
    ...(statusChange
      ? [
          prisma.activity.create({
            data: {
              lead: { connect: { id } },
              type: ActivityType.STATUS_CHANGED,
              performedByUser: { connect: { id: currentUser.id } },
              performedBy: currentUser.username,
              metadata: {
                change: formatStatusChange(statusChange.from, statusChange.to),
                from: statusChange.from,
                to: statusChange.to,
              },
            },
          }),
        ]
      : []),
    ...(priorityChange
      ? [
          prisma.activity.create({
            data: {
              lead: { connect: { id } },
              type: ActivityType.PRIORITY_CHANGED,
              performedByUser: { connect: { id: currentUser.id } },
              performedBy: currentUser.username,
              metadata: {
                change: formatPriorityChange(
                  priorityChange.from,
                  priorityChange.to,
                ),
                from: priorityChange.from,
                to: priorityChange.to,
              },
            },
          }),
        ]
      : []),
    ...(otherChanges.length > 0
      ? [
          prisma.activity.create({
            data: {
              lead: { connect: { id } },
              type: ActivityType.LEAD_UPDATED,
              performedByUser: { connect: { id: currentUser.id } },
              performedBy: currentUser.username,
              metadata: {
                fields: otherChanges,
              },
            },
          }),
        ]
      : []),
  ]);

  return updatedLead;
}
