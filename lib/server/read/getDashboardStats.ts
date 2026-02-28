import "server-only";
import { prisma } from "@/lib/db";
import {
  getStartOfToday,
  getStartOfWeek,
  getStartOfMonth,
} from "@/lib/utils/dates";

export interface GetDashboardStatsPromise {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export async function getDashboardStats(): Promise<GetDashboardStatsPromise> {
  const todayStart = getStartOfToday();
  const weekStart = getStartOfWeek();
  const monthStart = getStartOfMonth();

  const [total, today, thisWeek, thisMonth] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({
      where: { createdAt: { gte: todayStart } },
    }),
    prisma.lead.count({
      where: { createdAt: { gte: weekStart } },
    }),
    prisma.lead.count({
      where: { createdAt: { gte: monthStart } },
    }),
  ]);

  return { total, today, thisWeek, thisMonth };
}
