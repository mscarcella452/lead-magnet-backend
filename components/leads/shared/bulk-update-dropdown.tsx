import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { ChevronDown } from "lucide-react";
import type { OptionConfig } from "@/config/lead-config";
import { Button, ButtonProps } from "@/components/ui/controls";

export interface BulkUpdateDropdownProps<T extends string> extends ButtonProps {
  config: Record<T, OptionConfig>;
  onUpdateChange: (value: T) => void | Promise<void>;
  triggerLabel: string;
}

export function BulkUpdateDropdown<T extends string>({
  config,
  onUpdateChange,
  triggerLabel,
  ...props
}: BulkUpdateDropdownProps<T>) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = async (next: T) => {
    setIsUpdating(true);
    try {
      await onUpdateChange(next);
    } finally {
      setIsUpdating(false);
    }
  };

  const entries = Object.entries(config) as [T, OptionConfig][];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <Button intent="outline" size="xs" {...props}>
          {triggerLabel}
          <ChevronDown className="opacity-45" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel className="text-xs">
          Set selected to
        </DropdownMenuLabel>
        <DropdownMenuGroup>
          {entries.map(([option, optionConfig]) => {
            const { label } = optionConfig;
            return (
              <DropdownMenuItem
                key={option}
                onClick={() => handleChange(option)}
                className="flex items-center gap-2"
              >
                {label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
