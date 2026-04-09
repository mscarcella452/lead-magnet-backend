import { cn } from "@/lib/utils";
import { Text, CodeInline, Tailwind } from "@react-email/components";

export const CopyLink = ({
  link,
  className,
}: {
  link: string;
  className?: string;
}) => {
  return (
    <p className={cn("text-subtle-foreground text-sm break-all", className)}>
      Or copy this link:{" "}
      <CodeInline className="bg-card px-1.5 py-0.5 rounded text-sm font-mono">
        {link}
      </CodeInline>
    </p>
  );
};
