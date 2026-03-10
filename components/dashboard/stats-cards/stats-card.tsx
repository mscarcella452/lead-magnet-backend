import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Container } from "@/components/ui/layout/containers";
import { Badge } from "@/components/ui/feedback/badge";
import { StatCardData } from "@/components/dashboard/stats-cards/lib/types";

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
// StatCard
// ============================================================================

export function StatsCard({ title, value, icon: Icon, trend }: StatCardData) {
  return (
    <Card size="md" variant="panel" border className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        <Icon aria-hidden="true" className="size-4 text-subtle-foreground" />
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
