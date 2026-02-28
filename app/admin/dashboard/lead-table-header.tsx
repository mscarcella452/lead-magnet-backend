import { ExportButton } from "./ExportButton";
import { Container } from "@/components/ui/layout/containers";
import type { LeadTableRow } from "@/types";

const LeadTableHeader = ({ leads }: { leads: LeadTableRow[] }) => {
  return (
    <Container spacing="none" position="start" className="gap-1">
      <h4 className="font-medium">Recent Leads</h4>
      <p className="text-muted-foreground text-sm">
        Showing the {leads.length} most recent leads
      </p>
    </Container>
  );
};

export { LeadTableHeader };
