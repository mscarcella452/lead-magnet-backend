import { useState } from "react";
import { exportLeadCSVAction } from "@/lib/server/actions/read/exportLeadsCSVAction";
import { downloadCSV } from "@/lib/helpers/lead-csv";
import { formatDateForFilename } from "@/lib/utils/dates";
import { toast } from "sonner";

export function useExportLeads() {
  const [isExporting, setIsExporting] = useState(false);

  const exportLeads = async (leadIds?: string[]) => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const result = await exportLeadCSVAction(leadIds);
      if (result.success) {
        const filename = leadIds?.length
          ? `leads-export-selected-${formatDateForFilename()}.csv`
          : `leads-export-all-${formatDateForFilename()}.csv`;
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

  return { exportLeads, isExporting };
}
