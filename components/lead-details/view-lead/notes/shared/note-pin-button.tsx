"use client";

import { Button } from "@/components/ui/controls";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Pin, PinOff } from "lucide-react";
import { PIN_ICON_TRANSITION } from "@/components/lead-details/view-lead/notes/lib/constants";

// ============================================================================
// types
// ============================================================================

interface NotePinButtonProps {
  onClick: () => void;
  className?: string;
}

// ============================================================================
// NotePinButton
// ============================================================================

export function NotePinButton({ onClick, className }: NotePinButtonProps) {
  return (
    <Button
      variant="brand"
      intent="ghost-text"
      mode="iconOnly"
      className={cn("relative text-brand-text!", className)}
      aria-label="Unpin note"
      onClick={onClick}
    >
      <motion.span
        initial={false}
        animate="rest"
        whileHover="hover"
        transition={PIN_ICON_TRANSITION}
      >
        <Pin aria-hidden="true" />

        <motion.span
          className="absolute inset-0 pointer-events-none"
          variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
          aria-hidden="true"
        >
          <PinOff />
        </motion.span>
      </motion.span>
    </Button>
  );
}
