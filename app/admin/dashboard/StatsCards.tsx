import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/layout/card";
import { Users, TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { Container } from "@/components/ui/layout/containers";

/**
 * Stats Cards Component (Server Component)
 *
 * Displays key metrics in card format.
 */

interface StatsCardsProps {
  stats: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Leads",
      value: stats.total,
      icon: Users,
      description: "All time",
    },
    {
      title: "Today",
      value: stats.today,
      icon: TrendingUp,
      description: "Leads today",
    },
    {
      title: "This Week",
      value: stats.thisWeek,
      icon: Calendar,
      description: "Last 7 days",
    },
    {
      title: "This Month",
      value: stats.thisMonth,
      icon: BarChart3,
      description: "Current month",
    },
  ];

  return (
    <Container
      spacing="group"
      width="full"
      className="grid @xs:grid-cols-2 @5xl:grid-cols-4"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card size="sm" variant="card" key={card.title}>
            <Container spacing="block">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>

                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold text-brand-text">
                  {card.value}
                </div>
                <p className="text-xs text-subtle-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Container>
          </Card>
        );
      })}
    </Container>
  );
}
