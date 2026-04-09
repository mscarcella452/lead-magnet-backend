import { Card, CardContent, CardProps } from "@/components/ui/layout/card";
import { FieldSet } from "@/components/ui/forms";
import { Container } from "@/components/ui/layout/containers";
import { FieldDescription, FieldLegend } from "@/components/ui/forms";

interface AccountFieldCardProps extends CardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export const AccountFieldCard = ({
  title,
  description,
  children,
  ...props
}: AccountFieldCardProps) => {
  return (
    <Card
      variant="panel"
      size="sm"
      className="shadow-xs @max-3xl/form-layout:border"
      {...props}
    >
      <CardContent>
        <FieldSet>
          <Container spacing="item">
            <FieldLegend>{title}</FieldLegend>
            <FieldDescription>{description}</FieldDescription>
          </Container>
          {children}
        </FieldSet>
      </CardContent>
    </Card>
  );
};
