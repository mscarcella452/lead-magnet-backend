import "server-only";
import { Lead, LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatStatusChange } from "@/lib/helpers/lead-changes";

// ============================================================================
// updateLeadStatus(id: string, status: LeadStatus): Promise<Lead>
// Updates a lead's status and logs activity as side effect
// Only logs activity if status actually changed
// ============================================================================

export interface UpdateLeadStatusData {
  leadId: string;
  newStatus: LeadStatus;
  performedBy: string;
}

export async function updateLeadStatus(
  data: UpdateLeadStatusData,
): Promise<Lead> {
  // Get current lead to track status change
  const currentLead = await prisma.lead.findUnique({
    where: { id: data.leadId },
    select: { id: true, status: true },
  });

  if (!currentLead) {
    throw new Error("Lead not found");
  }

  // Skip update if status unchanged
  if (currentLead.status === data.newStatus) {
    // Return current lead without DB write
    return prisma.lead.findUniqueOrThrow({ where: { id: data.leadId } });
  }

  // Update lead and log activity in transaction
  const [updatedLead] = await prisma.$transaction([
    prisma.lead.update({
      where: { id: data.leadId },
      data: { status: data.newStatus },
    }),
    prisma.activity.create({
      data: {
        leadId: data.leadId,
        type: "STATUS_CHANGED",
        performedBy: data.performedBy,
        metadata: {
          change: formatStatusChange(currentLead.status, data.newStatus),
          from: currentLead.status,
          to: data.newStatus,
        },
      },
    }),
  ]);

  return updatedLead;
}
