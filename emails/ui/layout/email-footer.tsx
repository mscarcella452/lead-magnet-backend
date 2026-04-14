import { Section } from "@react-email/components";
import { EmailSeperator } from "./email-seperator";

interface EmailFooterProps {
  description?: string;
  children?: React.ReactNode;
}

export const EmailFooter = ({ description, children }: EmailFooterProps) => {
  return (
    <Section className="mt-8">
      <EmailSeperator />
      {description && (
        <p className="text-subtle-foreground text-xs mt-2">{description}</p>
      )}

      {children}
    </Section>
  );
};
