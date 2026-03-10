import { Download, LoaderCircle } from "lucide-react";

// used in both buttons
export function ExportIcon({ isExporting }: { isExporting: boolean }) {
  return isExporting ? (
    <LoaderCircle aria-hidden="true" className="animate-spin" />
  ) : (
    <Download aria-hidden="true" />
  );
}
