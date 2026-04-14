"use client";

import { Activity, ActivityType } from "@prisma/client";
import { formatDate } from "@/lib/utils/dates";
import { Container } from "@/components/ui/layout/containers";
import { StatusBadge } from "@/components/field-controls/status";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/layout/card";
import { ComponentProps } from "react";
import { PriorityBadge } from "@/components/field-controls/priority";
import { SourceBadge } from "@/components/field-controls/source";
import { Badge } from "@/components/ui/feedback/badge";

// ============================================================================
// Types
// ============================================================================

interface ActivityItemProps extends ComponentProps<typeof Card> {
  activity: Activity;
}

type ActivityMetadata = Record<string, any>;

interface MetadataContentProps {
  metadata: ActivityMetadata;
}

// ============================================================================
// Constants
// ============================================================================

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  LEAD_CREATED: "Lead created",
  STATUS_CHANGED: "Status changed",
  LEAD_UPDATED: "Lead updated",
  PRIORITY_CHANGED: "Priority changed",
};

const labelClassName = "capitalize text-caption";

// ============================================================================
// Metadata Renderers
// Renders type-specific content based on activity metadata
// ============================================================================

const ArrowIcon = () => (
  <span aria-hidden="true" className="text-caption">
    →
  </span>
);

function StatusChangeContent({ metadata }: MetadataContentProps) {
  if (!metadata.from || !metadata.to) return null;

  return (
    <Container spacing="item" className="flex flex-row items-center">
      <StatusBadge status={metadata.from} />
      <ArrowIcon />
      <StatusBadge status={metadata.to} />
    </Container>
  );
}
function PriorityChangeContent({ metadata }: MetadataContentProps) {
  if (!metadata.from || !metadata.to) return null;

  return (
    <Container spacing="item" className="flex flex-row items-center">
      <PriorityBadge priority={metadata.from} />
      <ArrowIcon />
      <PriorityBadge priority={metadata.to} />
    </Container>
  );
}

function LeadCreatedContent({ metadata }: MetadataContentProps) {
  if (!metadata.source) return null;

  return (
    <Container spacing="item" className="flex flex-row items-center">
      <span className={labelClassName}>source:</span>

      <SourceBadge intent="soft" source={metadata.source} />
    </Container>
  );
}

function LeadUpdatedContent({ metadata }: MetadataContentProps) {
  if (!metadata.fields || metadata.fields.length === 0) return null;

  return (
    <Container as="dl" spacing="group" className="flex flex-col ">
      {metadata.fields.map(
        (field: { field: string; change: string; from: any; to: any }) => (
          <Container spacing="item" key={field.field} className="flex flex-col">
            <dt className={labelClassName}>{field.field}:</dt>

            <Container
              as="dd"
              spacing="item"
              className="flex flex-row flex-wrap items-center min-w-0"
            >
              <Badge
                intent="outline"
                size="sm"
                className="opacity-70 min-w-0 truncate"
              >
                <span className="truncate">{field.from}</span>
              </Badge>
              <span className="sr-only">changed to</span>
              <ArrowIcon />

              <Badge intent="outline" size="sm" className="min-w-0">
                <span className="truncate">{field.to}</span>
              </Badge>
            </Container>
          </Container>
        ),
      )}
    </Container>
  );
}

// ============================================================================
// Renderer Map
// Maps activity types to their corresponding content renderers
// ============================================================================

const ACTIVITY_RENDERERS: Record<
  ActivityType,
  React.FC<MetadataContentProps>
> = {
  LEAD_CREATED: LeadCreatedContent,
  LEAD_UPDATED: LeadUpdatedContent,
  STATUS_CHANGED: StatusChangeContent,
  PRIORITY_CHANGED: PriorityChangeContent,
};

// ============================================================================
// Component
// ============================================================================

function ActivityItem({ activity, ...props }: ActivityItemProps) {
  const metadata = activity.metadata as ActivityMetadata;
  const label = ACTIVITY_LABELS[activity.type as ActivityType] || activity.type;
  const formattedDate = formatDate(activity.createdAt);
  const MetadataRenderer = ACTIVITY_RENDERERS[activity.type as ActivityType];

  return (
    <Card variant="outline" size="sm" {...props}>
      <CardHeader className="flex flex-row items-baseline gap-2 text-xs">
        {activity.performedBy && (
          <>
            <span className="font-medium text-foreground">
              {activity.performedBy}
            </span>
            <span aria-hidden="true" className="text-caption">
              •
            </span>
          </>
        )}
        <CardTitle className="font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <span aria-hidden="true" className="text-caption">
          •
        </span>
        <span className="text-caption">{formattedDate}</span>
      </CardHeader>

      {metadata && MetadataRenderer && (
        <CardContent className="text-sm">
          <MetadataRenderer metadata={metadata} />
        </CardContent>
      )}
    </Card>
  );
}

export { ActivityItem };
