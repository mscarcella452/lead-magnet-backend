// /lib/server/write/updateLead.ts
import "server-only";
import { Lead } from "@prisma/client";
import { prisma } from "@/lib/db";
import { trackLeadChanges } from "@/lib/helpers/lead-changes";
import { ActivityType } from "@prisma/client";
import { LeadMetadataUpdate } from "@/types/lead-fields";

export type UpdateLeadData = Partial<
  Pick<Lead, "name" | "email" | "source" | "status" | "priority" | "metadata">
>;

// ============================================================================
// updateLead(id: string, data: UpdateLeadData): Promise<Lead>
// Updates a lead and logs activity for each changed field as side effect
// ============================================================================

export async function updateLead(
  id: string,
  data: UpdateLeadData,
  editedBy?: string,
): Promise<Lead> {
  // Get current lead to compare changes
  const currentLead = await prisma.lead.findUnique({
    where: { id },
  });

  if (!currentLead) {
    throw new Error("Lead not found");
  }

  // Track what changed using helper
  const changes = trackLeadChanges(currentLead, data);

  // Update lead and log activity in transaction
  const [updatedLead, _activity] = await prisma.$transaction([
    prisma.lead.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(data.source !== undefined && { source: data.source }),
        ...(data.status && { status: data.status }),
        ...(data.priority && { priority: data.priority }),
        ...(data.metadata && {
          metadata: data.metadata as LeadMetadataUpdate,
        }),
      },
    }),
    // Only log activity if something actually changed
    ...(changes.length > 0
      ? [
          prisma.activity.create({
            data: {
              leadId: id,
              type: ActivityType.LEAD_UPDATED,
              performedBy: editedBy || "You",
              metadata: {
                fields: changes.map((change) => {
                  const [field, ...rest] = change.split(" from ");
                  return { field, change };
                }),
              },
            },
          }),
        ]
      : []),
  ]);

  return updatedLead;
}
