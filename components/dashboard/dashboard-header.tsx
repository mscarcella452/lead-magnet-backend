import { Container } from "@/components/ui/layout/containers";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

interface DashboardHeaderProps {
  header: string;
  subheader: string;
  action?: React.ReactNode;
  className?: string;
}

// ============================================================================
// Component
// ============================================================================

export function DashboardHeader({
  header,
  subheader,
  action,
  className,
}: DashboardHeaderProps) {
  return (
    <header>
      <Container
        spacing="group"
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
        {action}
        <p className="text-sm @3xl:text-base text-muted-foreground col-span-full">
          {subheader}
        </p>
      </Container>
    </header>
  );
}
