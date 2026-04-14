import "server-only";
import { Lead, LeadStatus, ActivityType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatStatusChange } from "@/lib/leads/helpers/changes";
import { getCurrentUser } from "@/lib/server/auth/read/getCurrentUser";

// ============================================================
// Types
// ============================================================

export interface UpdateLeadStatusData {
  leadId: string;
  newStatus: LeadStatus;
}

// ============================================================
// updateLeadStatus
// ============================================================

/**
 * Updates a lead's status and logs activity as a side effect.
 * No-ops if the status hasn't changed.
 * Requires an authenticated user — performedBy is derived from session.
 */
export async function updateLeadStatus(
  data: UpdateLeadStatusData,
): Promise<Lead> {
  const currentUser = await getCurrentUser();
  if (!currentUser) throw new Error("Unauthorized");

  const currentLead = await prisma.lead.findUnique({
    where: { id: data.leadId },
    select: { id: true, status: true },
  });
  if (!currentLead) throw new Error("Lead not found.");

  if (currentLead.status === data.newStatus) {
    return prisma.lead.findUniqueOrThrow({ where: { id: data.leadId } });
  }

  const [updatedLead] = await prisma.$transaction([
    prisma.lead.update({
      where: { id: data.leadId },
      data: { status: data.newStatus },
    }),
    prisma.activity.create({
      data: {
        lead: { connect: { id: data.leadId } },
        type: ActivityType.STATUS_CHANGED,
        performedByUser: { connect: { id: currentUser.id } },
        performedBy: currentUser.username,
        metadata: formatStatusChange(currentLead.status, data.newStatus),
      },
    }),
  ]);

  return updatedLead;
}
