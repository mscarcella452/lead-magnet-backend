import { ExportButton } from "./ExportButton";
import { Container } from "@/components/ui/layout/containers";
import { Moon } from "lucide-react";

const DashboardHeader = () => {
  return (
    <Container
      spacing="content"
      className="flex flex-row items-center justify-between"
    >
      <div>
        <h1 className="text-2xl @3xl:text-3xl font-bold tracking-tight text-display">
          Dashboard
        </h1>
        <p className="text-sm @3xl:text-base text-muted-foreground">
          Manage your leads and view statistics
        </p>
      </div>

      <ExportButton />
    </Container>
  );
};

export { DashboardHeader };
