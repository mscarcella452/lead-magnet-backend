import { Container } from "@/components/ui/layout/containers";
import type { TeamMemberFormData } from "@/lib/team/team-forms/types";
import { Badge } from "@/components/ui/feedback/badge";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/layout/card";

interface TeamMemberConfirmProps {
  formData: TeamMemberFormData;
}

const Row = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) => (
  <Container spacing="item" className="flex flex-row items-center ">
    <span className="text-xs text-subtle-foreground">{label}:</span>
    <Badge
      // variant="brand"
      // intent="soft"
      intent="outline"
      className={cn("font-medium", className)}
    >
      {value}
    </Badge>
  </Container>
);

export const TeamMemberConfirm = ({ formData }: TeamMemberConfirmProps) => (
  // <Card size="xs" variant="card-blur">
  <Container spacing="group">
    <Row label="Name" value={formData.name} className="capitalize" />
    <Row label="Email" value={formData.email} />
    <Row
      label="Role"
      value={formData.role.charAt(0) + formData.role.slice(1).toLowerCase()}
    />
  </Container>
  // </Card>
);
