import { Section } from "@react-email/components";

interface EmailHeadingProps {
  heading: string | React.ReactNode;
  subHeading: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const EmailHeading = ({
  heading,
  subHeading,
  children,
  className,
}: EmailHeadingProps) => {
  return (
    <Section className={className}>
      <h2 className="text-2xl font-semibold mb-2">{heading}</h2>
      <p className="text-muted-foreground leading-relaxed text-sm">
        {subHeading}
      </p>
      {children}
    </Section>
  );
};
