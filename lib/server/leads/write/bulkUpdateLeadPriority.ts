import "server-only";
import { Lead, LeadPriority } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatPriorityChange } from "@/lib/leads/helpers/changes";
import { getCurrentUser } from "@/lib/auth/auth-server-actions";

export interface BulkUpdateLeadPriorityData {
  leadIds: string[];
  newPriority: LeadPriority;
}

export async function bulkUpdateLeadPriority(
  data: BulkUpdateLeadPriorityData,
): Promise<Lead[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const currentLeads = await prisma.lead.findMany({
    where: { id: { in: data.leadIds } },
    select: { id: true, priority: true },
  });

  if (currentLeads.length === 0) throw new Error("No leads found");

  const leadsToUpdate = currentLeads.filter(
    (l) => l.priority !== data.newPriority,
  );

  if (leadsToUpdate.length === 0) {
    return prisma.lead.findMany({ where: { id: { in: data.leadIds } } });
  }

  const idsToUpdate = leadsToUpdate.map((l) => l.id);

  const activityRecords = leadsToUpdate.map((lead) => ({
    leadId: lead.id,
    type: "PRIORITY_CHANGED" as const,
    performedBy: user.username,
    metadata: {
      change: formatPriorityChange(lead.priority, data.newPriority),
      from: lead.priority,
      to: data.newPriority,
    },
  }));

  await prisma.$transaction([
    prisma.lead.updateMany({
      where: { id: { in: idsToUpdate } },
      data: { priority: data.newPriority },
    }),
    prisma.activity.createMany({ data: activityRecords }),
  ]);

  return prisma.lead.findMany({ where: { id: { in: data.leadIds } } });
}
