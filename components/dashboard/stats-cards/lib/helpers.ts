import type { GetDashboardStatsResult } from "@/lib/server/leads/read/getDashboardStats";
import type { StatCardData } from "@/components/dashboard/stats-cards/lib/types";
import { CARD_CONFIGS } from "@/components/dashboard/stats-cards/config";

// ============================================================================
// Helpers
// ============================================================================

export function buildCards(stats: GetDashboardStatsResult): StatCardData[] {
  return CARD_CONFIGS.map((config) => ({
    title: config.title,
    icon: config.icon,
    value: config.getValue(stats),
    trend: "getTrend" in config ? config.getTrend(stats) : undefined,
  }));
}
