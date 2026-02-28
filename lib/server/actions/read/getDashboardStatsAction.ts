"use server";
import { unstable_cache } from "next/cache";
import {
  getDashboardStats,
  type GetDashboardStatsPromise,
} from "@/lib/server/read/getDashboardStats";
import { ActionResult } from "@/types/server";
import { CACHE_TAGS } from "@/lib/server/constants";

export async function getDashboardStatsAction(): Promise<
  ActionResult<GetDashboardStatsPromise>
> {
  try {
    const cachedStats = unstable_cache(
      async () => getDashboardStats(),
      [CACHE_TAGS.DASHBOARD_STATS],
      {
        revalidate: 300, // Cache for 5 minutes
        tags: [CACHE_TAGS.LEADS, CACHE_TAGS.DASHBOARD_STATS],
      },
    );

    const stats = await cachedStats();
    return { success: true, data: stats };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, error: "Failed to fetch stats" };
  }
}
