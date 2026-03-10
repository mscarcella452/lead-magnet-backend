import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils/classnames";

export const Overlay = React.forwardRef<
  React.ElementRef<typeof motion.div>,
  React.ComponentProps<typeof motion.div>
>(({ className, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "fixed inset-0 z-50 surface-overlay-blur cursor-pointer",
        className,
      )}
      {...props}
    />
  );
});
Overlay.displayName = "Overlay";
