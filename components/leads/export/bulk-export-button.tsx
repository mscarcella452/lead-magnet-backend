"use client";

import {
  Button,
  type ButtonProps,
  ControlLabel,
} from "@/components/ui/controls";
import { useExportLeads } from "@/components/leads/export/useExportLeads";
import { ExportIcon } from "@/components/leads/export/export-icon";

// ============================================================================
// Types
// ============================================================================

interface ExportButtonProps extends ButtonProps {
  selectedLeads: Set<string>;
}

// ============================================================================
// Component
// ============================================================================

export function BulkExportButton({
  selectedLeads,
  ...props
}: ExportButtonProps) {
  const { exportLeads, isExporting } = useExportLeads();

  return (
    <Button
      size="xs"
      intent="soft"
      onClick={() => exportLeads(Array.from(selectedLeads))}
      disabled={isExporting}
      aria-disabled={isExporting}
      aria-label="Export selected leads"
      aria-live="polite"
      {...props}
    >
      <ExportIcon isExporting={isExporting} />
      Export
    </Button>
  );
}
