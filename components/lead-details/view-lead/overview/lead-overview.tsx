import { LeadWithRelations } from "@/types";
import { Container } from "@/components/ui/layout/containers";
import { LeadNotes } from "@/components/lead-details/view-lead/notes/lead-notes";
import { LeadActivity } from "@/components/lead-details/view-lead/activity/lead-activity";

interface LeadOverviewProps {
  lead: LeadWithRelations;
}

const LeadOverview = ({ lead }: LeadOverviewProps) => {
  return (
    <Container spacing="block">
      <LeadNotes limit={3} />
      <LeadActivity lead={lead} limit={3} />
    </Container>
  );
};

export { LeadOverview };
