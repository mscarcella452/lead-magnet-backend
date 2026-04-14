import { LeadWithRelations } from "@/types";
import { RelationsSection } from "@/components/lead-details/view-lead/shared/relations-section";
import { ActivityItem } from "@/components/lead-details/view-lead/activity/activity-item";
import { Container } from "@/components/ui/layout/containers";

// ============================================================================
// types
// ============================================================================

interface LeadActivityProps {
  lead: LeadWithRelations;
  limit?: number;
}

// ============================================================================
// LeadActivity - Activity section for a lead
// ============================================================================

const LeadActivity = ({ lead, limit }: LeadActivityProps) => {
  // Display either limited activities or all activities
  const displayedActivities = lead.activities.slice(0, limit);

  const hasActivities = displayedActivities.length > 0;

  const isFiltered = displayedActivities.length < lead.activities.length;

  return (
    <RelationsSection
      label="Activity"
      totalRelations={lead.activities.length}
      isFiltered={isFiltered}
    >
      <Container spacing="item" className="relative">
        {hasActivities ? (
          displayedActivities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No activities yet
          </p>
        )}
      </Container>
    </RelationsSection>
  );
};

export { LeadActivity };
