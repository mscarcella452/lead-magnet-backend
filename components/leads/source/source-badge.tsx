import { Badge, BadgeProps } from "@/components/ui/feedback/badge";

interface SourceBadgeProps extends BadgeProps {
  source: string;
}

export const SourceBadge = ({ source, ...props }: SourceBadgeProps) => {
  return (
    <Badge variant="primary" intent="soft" size="sm" {...props}>
      {source}
    </Badge>
  );
};
