import { Container } from "@/components/ui/layout/containers";
import { ExportAllButton } from "@/components/leads/export/export-all-button";

// ============================================================================
// Component
// ============================================================================

export function DashboardHeader() {
  return (
    <Container spacing="group" as="header" className="">
      <Container
        spacing="item"
        as="hgroup"
        className="flex flex-row items-center justify-between"
      >
        <h1 className="text-2xl @3xl:text-3xl font-bold tracking-tight text-display truncate">
          Dashboard
        </h1>
        <ExportAllButton />
      </Container>
      <p className="text-sm @3xl:text-base text-muted-foreground">
        Track and manage leads from your fitness campaigns
      </p>
    </Container>
  );
}
