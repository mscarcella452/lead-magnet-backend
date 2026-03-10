import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/layout/dropdown-menu";
import { Chip, ChipProps } from "@/components/ui/controls/chip";
import { Check, ChevronDown } from "lucide-react";
import type { OptionConfig } from "@/config/lead-config";

export interface UpdateDropdownProps<T extends string> extends ChipProps {
  current: T;
  config: Record<T, OptionConfig>;
  onUpdateChange: (value: T) => void | Promise<void>;
}

export function UpdateDropdown<T extends string>({
  current,
  config,
  onUpdateChange,
  ...props
}: UpdateDropdownProps<T>) {
  const [optimisticValue, setOptimisticValue] = useState<T>(current);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setOptimisticValue(current);
  }, [current]);

  const handleChange = async (next: T) => {
    if (next === current) return;
    setOptimisticValue(next);
    setIsUpdating(true);
    try {
      await onUpdateChange(next);
    } catch (error) {
      setOptimisticValue(current);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const currentConfig = config[optimisticValue];
  const entries = Object.entries(config) as [T, OptionConfig][];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isUpdating}>
        <Chip
          variant={currentConfig.variant}
          intent="soft"
          size="sm"
          {...props}
        >
          {currentConfig.label}
          <ChevronDown aria-hidden="true" />
        </Chip>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          {entries.map(([option, optionConfig]) => {
            const isCurrent = option === optimisticValue;
            return (
              <DropdownMenuItem
                key={option}
                onClick={() => handleChange(option)}
                className="flex items-center justify-between gap-2"
                aria-current={isCurrent ? "true" : undefined}
                disabled={isCurrent}
              >
                <span>{optionConfig.label}</span>
                {isCurrent && <Check aria-hidden="true" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
