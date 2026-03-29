import "server-only";
import { Lead, LeadStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatStatusChange } from "@/lib/helpers/lead-changes";
import { getCurrentUser } from "@/lib/auth-helpers";

export interface BulkUpdateLeadStatusData {
  leadIds: string[];
  newStatus: LeadStatus;
}

export async function bulkUpdateLeadStatus(
  data: BulkUpdateLeadStatusData,
): Promise<Lead[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  // Fetch all leads to check current statuses
  const currentLeads = await prisma.lead.findMany({
    where: { id: { in: data.leadIds } },
    select: { id: true, status: true },
  });

  if (currentLeads.length === 0) throw new Error("No leads found");

  // Filter out leads that already have the target status
  const leadsToUpdate = currentLeads.filter((l) => l.status !== data.newStatus);

  if (leadsToUpdate.length === 0) {
    return prisma.lead.findMany({ where: { id: { in: data.leadIds } } });
  }

  const idsToUpdate = leadsToUpdate.map((l) => l.id);

  const activityRecords = leadsToUpdate.map((lead) => ({
    leadId: lead.id,
    type: "STATUS_CHANGED" as const,
    performedBy: user.role,
    metadata: {
      change: formatStatusChange(lead.status, data.newStatus),
      from: lead.status,
      to: data.newStatus,
    },
  }));

  await prisma.$transaction([
    prisma.lead.updateMany({
      where: { id: { in: idsToUpdate } },
      data: { status: data.newStatus },
    }),
    prisma.activity.createMany({ data: activityRecords }),
  ]);

  return prisma.lead.findMany({ where: { id: { in: data.leadIds } } });
}
