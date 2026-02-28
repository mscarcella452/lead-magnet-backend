import * as React from "react";
import { cn } from "@/lib/utils/index";
import { inputVariants } from "@/design-system/cva-variants/input-variants";
import { type InputVariantProps } from "@/design-system/lib/types/cva-types";

export interface TextareaProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    InputVariantProps {
  hideFocus?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, radius, hideFocus = false, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          inputVariants({ size, radius }),
          { "focus-visible:outline-none focus-visible:ring-0": hideFocus },
          "h-auto min-h-[80px] resize-y",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
