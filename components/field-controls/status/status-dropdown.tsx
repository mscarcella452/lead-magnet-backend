import { LeadStatus } from "@prisma/client";
import { STATUS_CONFIG } from "@/config/field-controls-config";
import {
  UpdateDropdown,
  UpdateDropdownProps,
} from "../shared/update-dropdown";

export interface StatusDropdownProps extends Omit<
  UpdateDropdownProps<LeadStatus>,
  "current" | "config" | "onUpdateChange"
> {
  currentStatus: LeadStatus;
  onStatusChange: (status: LeadStatus) => void | Promise<void>;
}

export function StatusDropdown({
  currentStatus,
  onStatusChange,
  ...props
}: StatusDropdownProps) {
  return (
    <UpdateDropdown
      current={currentStatus}
      config={STATUS_CONFIG}
      onUpdateChange={onStatusChange}
      aria-label={`Current status: ${STATUS_CONFIG[currentStatus].label}. Click to change status.`}
      intent="soft"
      {...props}
    />
  );
}
