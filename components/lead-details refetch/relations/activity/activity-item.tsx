"use client";

import { Activity, ActivityType } from "@prisma/client";
import { formatDate } from "@/lib/utils/dates";
import { Container } from "@/components/ui/layout/containers";
import { StatusBadge } from "@/components/status";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/layout/card";
import { ComponentProps } from "react";
import { Badge } from "@/components/ui/feedback/badge";

// ============================================================================
// Types
// ============================================================================

interface ActivityItemProps extends ComponentProps<typeof Card> {
  relation: Activity;
}

type ActivityMetadata = Record<string, any>;

interface TextMetadataContentProps {
  value?: string;
  className?: string;
}

interface MetadataContentProps {
  metadata: ActivityMetadata;
}

// ============================================================================
// Constants
// ============================================================================

// type ActivityType =
//   | "STATUS_CHANGED"
//   | "LEAD_CREATED"
//   | "LEAD_UPDATED"
//   | "NOTE_ADDED";

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  LEAD_CREATED: "Lead created",
  STATUS_CHANGED: "Status changed",
  NOTE_ADDED: "Note added",
  LEAD_UPDATED: "Lead updated",
  NOTE_UPDATED: "Note updated",
  NOTE_DELETED: "Note deleted",
};

// ============================================================================
// Metadata Renderers
// Renders type-specific content based on activity metadata
// ============================================================================

function StatusChangeContent({ metadata }: MetadataContentProps) {
  if (!metadata.from || !metadata.to) return null;

  return (
    <Container
      spacing="item"
      className="flex flex-row items-center text-muted-foreground text-xs"
    >
      <StatusBadge status={metadata.from} />
      <span aria-hidden="true">→</span>
      <StatusBadge status={metadata.to} />
    </Container>
  );
}

function TextMetadataContent({ value, className }: TextMetadataContentProps) {
  if (!value) return null;
  return <span className={className}>{value}</span>;
}

function LeadCreatedContent({ metadata }: MetadataContentProps) {
  if (!metadata.source) return null;

  return (
    <Container spacing="item" className="flex flex-row items-center">
      <span className="text-muted-foreground text-xs ">Source:</span>{" "}
      <Badge size="sm" intent="soft">
        {metadata.source}
      </Badge>
    </Container>
  );
}

function NoteContent({ metadata }: MetadataContentProps) {
  return (
    <TextMetadataContent
      value={metadata.noteContent}
      className="line-clamp-1"
    />
  );
}

function LeadUpdatedContent({ metadata }: MetadataContentProps) {
  if (!metadata.fields || metadata.fields.length === 0) return null;

  const fieldChanges = metadata.fields
    .map((field: { change: string }) => field.change)
    .join(", ");

  return <TextMetadataContent value={fieldChanges} />;
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
  NOTE_ADDED: NoteContent,
  NOTE_UPDATED: NoteContent,
  NOTE_DELETED: NoteContent,
};

// ============================================================================
// Component
// ============================================================================

function ActivityItem({ relation: activity, ...props }: ActivityItemProps) {
  const metadata = activity.metadata as ActivityMetadata;
  const label = ACTIVITY_LABELS[activity.type as ActivityType] || activity.type;
  const formattedDate = formatDate(activity.createdAt);
  const MetadataRenderer = ACTIVITY_RENDERERS[activity.type as ActivityType];

  return (
    <Card variant="outline" size="sm" {...props}>
      <CardHeader className="flex flex-row items-baseline gap-2 text-xs">
        <span className="font-medium text-foreground">
          {activity.performedBy}
        </span>
        <span aria-hidden="true" className="text-caption">
          •
        </span>
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
