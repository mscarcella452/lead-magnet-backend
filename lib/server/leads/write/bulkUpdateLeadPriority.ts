import "server-only";
import { Lead, LeadPriority } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatPriorityChange } from "@/lib/leads/helpers/changes";
import { getCurrentUser } from "@/lib/server/auth/read/getCurrentUser";
import { ActivityType } from "@prisma/client";

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

  await prisma.$transaction([
    prisma.lead.updateMany({
      where: { id: { in: idsToUpdate } },
      data: { priority: data.newPriority },
    }),
    ...leadsToUpdate.map((lead) =>
      prisma.activity.create({
        data: {
          lead: { connect: { id: lead.id } },
          type: ActivityType.PRIORITY_CHANGED,
          performedByUser: { connect: { id: user.id } },
          performedBy: user.username,
          metadata: {
            change: formatPriorityChange(lead.priority, data.newPriority),
            from: lead.priority,
            to: data.newPriority,
          },
        },
      }),
    ),
  ]);

  return prisma.lead.findMany({ where: { id: { in: data.leadIds } } });
}
