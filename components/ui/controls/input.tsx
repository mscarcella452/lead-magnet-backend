import * as React from "react";
import { cn } from "@/lib/utils/index";
import { inputVariants } from "@/design-system/cva-variants/input-variants";
import { type InputVariantProps } from "@/design-system/lib/types/cva-types";

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    InputVariantProps {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, size, radius, focus = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ size, radius, focus }), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
