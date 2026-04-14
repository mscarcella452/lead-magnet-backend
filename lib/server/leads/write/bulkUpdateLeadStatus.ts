import "server-only";
import { Lead, LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatStatusChange } from "@/lib/leads/helpers/changes";
import { getCurrentUser } from "@/lib/server/auth/read/getCurrentUser";
import { ActivityType } from "@prisma/client";

export interface BulkUpdateLeadStatusData {
  leadIds: string[];
  newStatus: LeadStatus;
}

export async function bulkUpdateLeadStatus(
  data: BulkUpdateLeadStatusData,
): Promise<Lead[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const currentLeads = await prisma.lead.findMany({
    where: { id: { in: data.leadIds } },
    select: { id: true, status: true },
  });

  if (currentLeads.length === 0) throw new Error("No leads found");

  const leadsToUpdate = currentLeads.filter((l) => l.status !== data.newStatus);

  if (leadsToUpdate.length === 0) {
    return prisma.lead.findMany({ where: { id: { in: data.leadIds } } });
  }

  const idsToUpdate = leadsToUpdate.map((l) => l.id);

  await prisma.$transaction([
    prisma.lead.updateMany({
      where: { id: { in: idsToUpdate } },
      data: { status: data.newStatus },
    }),
    ...leadsToUpdate.map((lead) =>
      prisma.activity.create({
        data: {
          lead: { connect: { id: lead.id } },
          type: ActivityType.STATUS_CHANGED,
          performedByUser: { connect: { id: user.id } },
          performedBy: user.username,
          metadata: {
            change: formatStatusChange(lead.status, data.newStatus),
            from: lead.status,
            to: data.newStatus,
          },
        },
      }),
    ),
  ]);

  return prisma.lead.findMany({ where: { id: { in: data.leadIds } } });
}
