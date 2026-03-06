import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { CACHE_TAGS } from "@/lib/server/constants";
import {
  getStartOfToday,
  getStartOfWeek,
  getStartOfMonth,
  getStartOfYesterday,
  getEndOfYesterday,
  getStartOfLastWeek,
  getEndOfLastWeek,
  getStartOfLastMonth,
  getEndOfLastMonth,
} from "@/lib/utils/dates";

// ============================================================================
// Types
// ============================================================================

export interface GetDashboardStatsResult {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  todayVsYesterday: number;
  thisWeekVsLastWeek: number;
  thisMonthVsLast: number;
}

// ============================================================================
// Query
// ============================================================================

function percentChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100);
}

async function fetchDashboardStats(): Promise<GetDashboardStatsResult> {
  const [total, today, thisWeek, thisMonth, yesterday, lastWeek, lastMonth] =
    await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { createdAt: { gte: getStartOfToday() } } }),
      prisma.lead.count({ where: { createdAt: { gte: getStartOfWeek() } } }),
      prisma.lead.count({ where: { createdAt: { gte: getStartOfMonth() } } }),
      prisma.lead.count({
        where: {
          createdAt: { gte: getStartOfYesterday(), lte: getEndOfYesterday() },
        },
      }),
      prisma.lead.count({
        where: {
          createdAt: { gte: getStartOfLastWeek(), lte: getEndOfLastWeek() },
        },
      }),
      prisma.lead.count({
        where: {
          createdAt: { gte: getStartOfLastMonth(), lte: getEndOfLastMonth() },
        },
      }),
    ]);

  return {
    total,
    today,
    thisWeek,
    thisMonth,
    todayVsYesterday: percentChange(today, yesterday),
    thisWeekVsLastWeek: percentChange(thisWeek, lastWeek),
    thisMonthVsLast: percentChange(thisMonth, lastMonth),
  };
}

// ============================================================================
// Cached export
// Cache revalidates every 5 minutes or when LEADS tag is invalidated.
// ============================================================================

export const getDashboardStats = unstable_cache(
  fetchDashboardStats,
  [CACHE_TAGS.DASHBOARD_STATS],
  {
    revalidate: 300,
    tags: [CACHE_TAGS.LEADS, CACHE_TAGS.DASHBOARD_STATS],
  },
);
