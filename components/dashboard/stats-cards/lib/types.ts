import type { GetDashboardStatsResult } from "@/lib/server/read/getDashboardStats";
import type { LucideIcon } from "lucide-react";

// ============================================================================
// Types
// ============================================================================
export type CardConfig = Omit<StatCardData, "value" | "trend"> & {
  getValue: (s: GetDashboardStatsResult) => number;
  getTrend?: (s: GetDashboardStatsResult) => number;
};

export interface StatCardData {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
}
