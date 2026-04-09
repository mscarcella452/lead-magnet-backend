import { EmailSeperator } from "./email-seperator";

interface EmailFooterProps {
  description?: string;
  children?: React.ReactNode;
}

export const EmailFooter = ({ description, children }: EmailFooterProps) => {
  return (
    <div>
      <EmailSeperator className="mb-2" />
      {description && (
        <p className="text-subtle-foreground text-xs">{description}</p>
      )}

      {children}
    </div>
  );
};
