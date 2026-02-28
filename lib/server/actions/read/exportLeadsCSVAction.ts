"use server";
import { exportLeadCSV } from "@/lib/server/read/exportLeadsCSV";
import { ActionResult } from "@/types/server";

// ============================================================================
// exportLeadCSVAction(leadIds?: string[]): Promise<ActionResult<string>>
// Server action to export leads as CSV
// Optional leadIds parameter for exporting selected leads only
// ============================================================================

export async function exportLeadCSVAction(
  leadIds?: string[],
): Promise<ActionResult<string>> {
  try {
    const csv = await exportLeadCSV(leadIds);
    return { success: true, data: csv };
  } catch (error) {
    console.error("Error exporting leads to CSV:", error);
    return { success: false, error: "Failed to export leads" };
  }
}

// /app/admin/components/ExportAllButton.tsx

// "use client";

// import { exportLeadCSVAction } from "@/app/admin/actions";
// import { Button } from "@/components/ui/button";
// import { Download } from "lucide-react";
// import { toast } from "sonner";

// HOW MANY LEADS ARE EXPORTED?? ALL ARE JUST LATEST 100????

// export function ExportAllButton() {
//   const handleExport = async () => {
//     const result = await exportLeadCSVAction(); // No leadIds = export all

// if (result.success) {
//   downloadCSV(result.data, `leads-export-${new Date().toISOString().split("T")[0]}.csv`);
//   toast.success("Leads exported successfully");
// } else {
//   toast.error(result.error);
// }

//   return (
//     <Button onClick={handleExport} variant="outline">
//       <Download className="mr-2 h-4 w-4" />
//       Export All Leads
//     </Button>
//   );
// }

// selectedLeadsButton

// // /app/admin/components/LeadsTable.tsx

// "use client";

// import { useState } from "react";
// import { exportLeadCSVAction } from "@/app/admin/actions";
// import { Button } from "@/components/ui/button";
// import { Download } from "lucide-react";
// import { toast } from "sonner";

// export function LeadsTable({ leads }: { leads: Lead[] }) {
//   const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

//   const handleExportSelected = async () => {
//     if (selectedLeadIds.length === 0) {
//       toast.error("Please select leads to export");
//       return;
//     }

//     const result = await exportLeadCSVAction(selectedLeadIds); // Pass selected IDs

// if (result.success) {
//   downloadCSV(result.data, `leads-export-${new Date().toISOString().split("T")[0]}.csv`);
//   toast.success("Leads exported successfully");
// } else {
//   toast.error(result.error);
// }

//   return (
//     <div>
//       <div className="mb-4 flex gap-2">
//         <Button
//           onClick={handleExportSelected}
//           disabled={selectedLeadIds.length === 0}
//           variant="outline"
//         >
//           <Download className="mr-2 h-4 w-4" />
//           Export Selected ({selectedLeadIds.length})
//         </Button>
//       </div>

//       {/* Your table with checkboxes */}
//       {/* ... */}
//     </div>
//   );
// }
