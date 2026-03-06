"use client";

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/controls";
import { ControlLabel } from "@/components/ui/controls";
import { exportLeadCSVAction } from "@/lib/server/actions/read/exportLeadsCSVAction";
import { downloadCSV } from "@/lib/helpers/lead-csv";
import { formatDateForFilename } from "@/lib/utils/dates";
import type { ButtonProps } from "@/components/ui/controls";

// ============================================================================
// Types
// ============================================================================

interface ExportButtonProps extends ButtonProps {
  leadIds?: string[];
}

// ============================================================================
// Component
// ============================================================================

export function ExportButton({ leadIds, ...props }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      const result = await exportLeadCSVAction(leadIds);

      if (result.success) {
        const filename = `leads-export-${formatDateForFilename()}.csv`;
        downloadCSV(result.data, filename);
        toast.success("Leads exported successfully");
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Something went wrong exporting leads");
    } finally {
      setIsExporting(false);
    }
  };

  const label = leadIds ? "Export" : "Export All";
  const ariaLabel = leadIds ? "Export selected leads" : "Export all leads";

  return (
    <Button
      size="sm"
      intent="solid"
      mode="responsiveIcon"
      onClick={handleExport}
      disabled={isExporting}
      aria-disabled={isExporting}
      aria-label={ariaLabel}
      aria-live="polite"
      {...props}
    >
      {isExporting ? (
        <LoaderCircle aria-hidden="true" className="animate-spin" />
      ) : (
        <Download aria-hidden="true" />
      )}
      <ControlLabel>{label}</ControlLabel>
    </Button>
  );
}
