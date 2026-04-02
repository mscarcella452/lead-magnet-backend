// @/components/dialogs/team-member/shared/team-member-confirm.tsx
import { Container } from "@/components/ui/layout/containers";
import { type TeamMemberFormData } from "@/types/ui/dialog";
import { Badge } from "@/components/ui/feedback/badge";

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
    <Badge intent="outline" className={className}>
      {value}
    </Badge>
  </Container>
);

export const TeamMemberConfirm = ({ formData }: TeamMemberConfirmProps) => (
  <Container spacing="group">
    <Row label="Name" value={formData.name} className="capitalize" />
    <Row label="Email" value={formData.email} />
    <Row
      label="Role"
      value={formData.role.charAt(0) + formData.role.slice(1).toLowerCase()}
    />
  </Container>
);
