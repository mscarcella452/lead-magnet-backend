import { Container } from "@/components/ui/layout/containers";
import type { LeadTableRow } from "@/types";

// ============================================================================
// Lead Table Header Component
// ============================================================================

export interface LeadTableHeaderProps {
  leads: LeadTableRow[];
}

export const LeadTableHeader = ({ leads }: LeadTableHeaderProps) => {
  return (
    <Container spacing="none" position="start" className="gap-1">
      <h4 className="font-medium">Recent Leads</h4>
      <p className="text-muted-foreground text-sm" aria-live="polite">
        {leads.length === 0
          ? "No leads to show"
          : `Showing ${leads.length} most recent lead${leads.length === 1 ? "" : "s"}`}
      </p>
    </Container>
  );
};
