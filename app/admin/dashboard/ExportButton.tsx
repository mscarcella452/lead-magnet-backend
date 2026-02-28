"use client";

import { useState } from "react";
import { Button, ButtonProps, ControlLabel } from "@/components/ui/controls";
import { Download, LoaderCircle } from "lucide-react";

import { exportLeadCSVAction } from "@/lib/server/actions/read/exportLeadsCSVAction";
import { toast } from "sonner";
import { downloadCSV } from "@/lib/helpers/lead-csv";
import { formatDateForFilename } from "@/lib/utils/dates";

interface ExportButtonProps extends ButtonProps {
  leadIds?: string[];
}

export function ExportButton({ leadIds, ...props }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (isExporting) return;

    setIsExporting(true);

    try {
      const result = await exportLeadCSVAction(leadIds);

      if (result.success) {
        toast.success("Leads exported successfully");

        const filename = `leads-export-${formatDateForFilename()}.csv`;
        downloadCSV(result.data, filename);
      } else {
        toast.error(result.error);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const ButtonLabel = leadIds ? "Export" : "Export All";

  const AriaLabel = leadIds ? "Export selected leads" : "Export all leads";

  return (
    <Button
      size="sm"
      intent="solid"
      mode="responsiveIcon"
      onClick={handleExport}
      disabled={isExporting}
      aria-label={AriaLabel}
      {...props}
    >
      {isExporting ? <LoaderCircle className="animate-spin" /> : <Download />}
      <ControlLabel>{ButtonLabel}</ControlLabel>
    </Button>
  );
}
