import { LeadWithRelations } from "@/types";
import { Container } from "@/components/ui/layout/containers";
import { LeadNotes } from "@/components/lead-details/view-lead/notes/lead-notes";
import { LeadActivity } from "@/components/lead-details/view-lead/activity/lead-activity";
import { motion, LayoutGroup } from "motion/react";

interface LeadOverviewProps {
  lead: LeadWithRelations;
}

const LeadOverview = ({ lead }: LeadOverviewProps) => {
  return (
    <LayoutGroup>
      <Container spacing="block">
        <LeadNotes limit={3} />

        <motion.div layout="position">
          <LeadActivity lead={lead} limit={3} />
        </motion.div>
      </Container>
    </LayoutGroup>
  );
};

export { LeadOverview };
