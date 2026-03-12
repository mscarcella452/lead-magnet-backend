"use client";

import { Button } from "@/components/ui/controls";
import { ControlLabel } from "@/components/ui/controls";
import type { ButtonProps } from "@/components/ui/controls";
import { useExportLeads } from "@/components/leads/export/useExportLeads";
import { ExportIcon } from "@/components/leads/export/export-icon";

// ============================================================================
// ExportAllButton
// ============================================================================

export function ExportAllButton({ ...props }: ButtonProps) {
  const { exportLeads, isExporting } = useExportLeads();

  return (
    <Button
      size="sm"
      intent="solid"
      mode="responsiveIcon"
      onClick={() => exportLeads()}
      disabled={isExporting}
      aria-disabled={isExporting}
      aria-label={"Export all leads"}
      aria-live="polite"
      {...props}
    >
      <ExportIcon isExporting={isExporting} />
      <ControlLabel>Export All</ControlLabel>
    </Button>
  );
}
