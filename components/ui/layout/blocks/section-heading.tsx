import { Container } from "@/components/ui/layout/containers";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface SectionHeadingProps {
  header: string;
  subheader: string;
  action?: React.ReactNode;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function SectionHeading({
  header,
  subheader,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <header>
      <Container
        spacing="item"
        as="hgroup"
        className={cn(
          "grid items-center",
          { "grid-cols-[1fr_auto]": action },
          className,
        )}
      >
        <h1 className="text-2xl @3xl:text-3xl font-bold tracking-tight text-display truncate">
          {header}
        </h1>
        {action && action}
        <p className="text-sm @3xl:text-base text-muted-foreground col-span-full">
          {subheader}
        </p>
      </Container>
    </header>
  );
}
