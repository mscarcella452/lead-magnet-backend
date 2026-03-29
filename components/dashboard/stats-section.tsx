import "server-only";

import { getDashboardStats } from "@/lib/server/read/getDashboardStats";
import { StatsCard } from "@/components/dashboard/stats-cards";
import { Container } from "@/components/ui/layout/containers";
import { GRID_CLASS } from "@/components/dashboard/stats-cards/lib/constants";
import { buildCards } from "@/components/dashboard/stats-cards/lib/helpers";

// ============================================================================
// StatsSection
// ============================================================================

export async function StatsSection() {
  const stats = await getDashboardStats();
  return (
    <Container
      spacing="group"
      width="full"
      className={GRID_CLASS}
      role="region"
      aria-label="Dashboard statistics"
    >
      {buildCards(stats).map((card) => (
        <StatsCard key={card.title} {...card} />
      ))}
    </Container>
  );
}
