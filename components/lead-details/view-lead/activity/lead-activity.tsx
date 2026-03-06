import { LeadWithRelations } from "@/types";
import { RelationsHistory } from "@/components/lead-details/view-lead/shared/relations-history";
import { ActivityItem } from "@/components/lead-details/view-lead/activity/activity-item";

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

  return (
    <RelationsHistory
      label="Activity"
      relations={displayedActivities}
      totalRelations={lead.activities.length}
      Item={ActivityItem}
    />
  );
};

export { LeadActivity };
