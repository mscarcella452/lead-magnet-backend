import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/card";
import {
  Users,
  Sunrise,
  CalendarDays,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { Container } from "@/components/ui/layout/containers";
import { Skeleton } from "@/components/ui/feedback/skeleton";
import { cn } from "@/lib/utils/classnames";
import type { LucideIcon } from "lucide-react";
import type { GetDashboardStatsResult } from "@/lib/server/read/getDashboardStats";
import { Badge } from "@/components/ui/feedback/badge";

// ============================================================================
// Constants
// ============================================================================
const GRID_CLASS = "grid @md:grid-cols-2 @5xl:grid-cols-4";

// ============================================================================
// Types
// ============================================================================
interface StatCardData {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
}

export interface StatsCardsProps {
  stats?: GetDashboardStatsResult;
  error?: string;
}

// ============================================================================
// Config
// ============================================================================
type CardConfig = Omit<StatCardData, "value" | "trend"> & {
  getValue: (s: GetDashboardStatsResult) => number;
  getTrend?: (s: GetDashboardStatsResult) => number;
};

const CARD_CONFIGS = [
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

function buildCards(stats: GetDashboardStatsResult): StatCardData[] {
  return CARD_CONFIGS.map((config) => ({
    title: config.title,
    icon: config.icon,
    value: config.getValue(stats),
    trend: "getTrend" in config ? config.getTrend(stats) : undefined,
  }));
}

// ============================================================================
// Trend
// ============================================================================

interface TrendProps {
  value: number;
}

function Trend({ value }: TrendProps) {
  if (value === 0)
    return (
      <Badge intent="soft" size="sm" className="text-subtle-foreground!">
        No change
      </Badge>
    );

  const isPositive = value > 0;
  const absValue = Math.abs(value);
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <Badge
      variant={isPositive ? "success" : "destructive"}
      intent="soft"
      size="sm"
    >
      <TrendIcon aria-hidden="true" className="size-3" />
      {absValue}%
    </Badge>
  );
}

// ============================================================================
// StatCardItem
// ============================================================================

function StatCardItem({ title, value, icon: Icon, trend }: StatCardData) {
  return (
    <Card size="md" variant="panel" border className="h-full">
      <CardHeader className="flex flex-row items-center justify-between text-muted-foreground">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>

        <Icon aria-hidden="true" className="size-4" />
      </CardHeader>
      <CardContent className="h-full">
        <Container
          spacing="group"
          className="@5xl:mt-4 flex flex-row justify-between items-center"
        >
          <div
            className="text-2xl @5xl:text-4xl font-semibold text-brand-text"
            aria-label={`${title}: ${value.toLocaleString()}`}
          >
            {value.toLocaleString()}
          </div>
          {trend !== undefined && <Trend value={trend} />}
        </Container>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// StatsCardsSkeleton
// ============================================================================

function StatsCardsSkeleton() {
  return (
    <Container
      spacing="group"
      width="full"
      className={GRID_CLASS}
      role="status"
      aria-label="Loading statistics"
      aria-busy="true"
    >
      {Array.from({ length: 4 }, (_, i) => (
        <Card key={i} size="md" variant="card">
          <Container
            spacing="group"
            className="flex flex-row items-center justify-between"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="size-4 rounded-sm" />
          </Container>

          <Container
            spacing="group"
            className="@5xl:mt-4 flex flex-row justify-between items-center"
          >
            <Skeleton className="size-8 @5xl:size-10" />

            <Skeleton className="h-compact-h-sm w-14" />
          </Container>
        </Card>
      ))}
    </Container>
  );
}

// ============================================================================
// StatsCardsError
// ============================================================================

function StatsCardsError({ message }: { message: string }) {
  return (
    <Card
      size="md"
      variant="outline"
      className="w-full"
      role="alert"
      aria-live="assertive"
    >
      <Container
        spacing="item"
        className="flex flex-row items-center  text-sm text-destructive-text"
      >
        <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
        <p>{message}</p>
      </Container>
    </Card>
  );
}

// ============================================================================
// StatsCardsContent
// ============================================================================

function StatsCardsContent({ stats }: { stats: GetDashboardStatsResult }) {
  return (
    <Container
      spacing="group"
      width="full"
      className={GRID_CLASS}
      role="region"
      aria-label="Dashboard statistics"
    >
      {buildCards(stats).map((card) => (
        <StatCardItem key={card.title} {...card} />
      ))}
    </Container>
  );
}

// ============================================================================
// StatsCards — public API, routes to correct state
// ============================================================================

export function StatsCards({ stats, error }: StatsCardsProps) {
  if (error) return <StatsCardsError message={error} />;
  if (!stats) return <StatsCardsSkeleton />;
  return <StatsCardsContent stats={stats} />;
}
