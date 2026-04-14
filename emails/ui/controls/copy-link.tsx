import { Text, CodeInline, Tailwind, Section } from "@react-email/components";

export const CopyLink = ({
  link,
  className,
}: {
  link: string;
  className?: string;
}) => {
  return (
    <Section className={className}>
      <p className="text-subtle-foreground text-sm break-all mb-2">
        Or copy this link:
      </p>
      <CodeInline className="bg-card px-1.5 py-0.5 rounded text-sm font-mono">
        {link}
      </CodeInline>
    </Section>
  );
};
