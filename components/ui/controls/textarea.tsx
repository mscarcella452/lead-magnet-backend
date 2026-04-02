import * as React from "react";
import { cn } from "@/lib/utils/index";
import { inputVariants } from "@/design-system/cva-variants/input-variants";
import { type InputVariantProps } from "@/design-system/lib/types/cva-types";

export interface TextareaProps
  extends
    Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    InputVariantProps {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, radius, focus = "default", ...props }, ref) => {
    return (
      <textarea
        className={cn(
          inputVariants({ size, radius, focus, variant: "text-area" }),
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
