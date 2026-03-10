import "server-only";
import { Lead, LeadPriority } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatPriorityChange } from "@/lib/helpers/lead-changes";

// ============================================================================
// updateLeadPriority(id: string, priority: LeadPriority): Promise<Lead>
// Updates a lead's priority and logs activity as side effect
// Only logs activity if priority actually changed
// ============================================================================

export interface UpdateLeadPriorityData {
  leadId: string;
  newPriority: LeadPriority;
  performedBy: string;
}

export async function updateLeadPriority(
  data: UpdateLeadPriorityData,
): Promise<Lead> {
  const currentLead = await prisma.lead.findUnique({
    where: { id: data.leadId },
    select: { id: true, priority: true },
  });

  if (!currentLead) throw new Error("Lead not found");

  if (currentLead.priority === data.newPriority) {
    return prisma.lead.findUniqueOrThrow({ where: { id: data.leadId } });
  }

  const [updatedLead] = await prisma.$transaction([
    prisma.lead.update({
      where: { id: data.leadId },
      data: { priority: data.newPriority },
    }),
    prisma.activity.create({
      data: {
        leadId: data.leadId,
        type: "PRIORITY_CHANGED",
        performedBy: data.performedBy,
        metadata: {
          change: formatPriorityChange(currentLead.priority, data.newPriority),
          from: currentLead.priority,
          to: data.newPriority,
        },
      },
    }),
  ]);

  return updatedLead;
}
