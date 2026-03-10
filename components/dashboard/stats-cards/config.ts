import { Users, Sunrise, CalendarDays, LayoutGrid } from "lucide-react";
import type { CardConfig } from "@/components/dashboard/stats-cards/lib/types";

// ============================================================================
// Config
// ============================================================================

export const CARD_CONFIGS = [
  {
    title: "Total Leads",
    icon: Users,
    getValue: (s) => s.total,
  },
  {
    title: "Today",
    icon: Sunrise,
    getValue: (s) => s.today,
    getTrend: (s) => s.todayVsYesterday,
  },
  {
    title: "Last 7 Days",
    icon: CalendarDays,
    getValue: (s) => s.thisWeek,
    getTrend: (s) => s.thisWeekVsLastWeek,
  },
  {
    title: "This Month",
    icon: LayoutGrid,
    getValue: (s) => s.thisMonth,
    getTrend: (s) => s.thisMonthVsLast,
  },
] as const satisfies CardConfig[];
