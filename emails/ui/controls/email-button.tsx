import { Button } from "@react-email/components";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils/classnames";
import { m } from "motion/react";

type Size = "sm" | "md" | "lg" | "none";
type Intent = "solid" | "soft" | "outline" | "ghost" | "text" | "ghost-text";

const buttonVariants = cva(
  "inline-block rounded-lg transition-colors duration-500 cursor-pointer w-fit font-medium ",

  {
    variants: {
      intent: {
        solid: "bg-brand text-brand-foreground hover:bg-brand-hover",
        soft: "bg-brand-soft text-brand-soft-foreground hover:bg-brand-soft-hover",
        outline:
          "border bg-transparent hover:bg-brand-hover text-brand-text hover:text-brand-text-hover",
        ghost:
          "bg-transparent shadow-none text-brand-text hover:text-brand-text-hover",
        text: "h-fit p-0! hover:underline hover:underline-offset-4",
        "ghost-text": "h-fit p-0! text-brand-text hover:text-brand-text-hover",
      },
      size: {
        sm: "py-2 px-3 text-sm",
        md: "py-3 px-4 text-sm",
        lg: "py-3 px-5 text-base",
        none: "",
      },
    },
    defaultVariants: {
      intent: "solid",
      size: "md",
    },
  },
);

export interface EmailButtonProps {
  children: string;
  href: string;
  // intent?: Intent;
  // size?: Size;
  className?: string;
}

export const EmailButton = ({
  children,
  className,
  href,
  // intent,
  // size,
}: EmailButtonProps) => {
  return (
    <Button
      // className={cn(buttonVariants({ intent, size }), className)}
      className={cn(
        "py-3 px-4 text-sm bg-brand text-brand-foreground hover:bg-brand-hover inline-block rounded-lg transition-colors duration-500 cursor-pointer w-fit font-medium",
        className,
      )}
      href={href}
    >
      {children}
    </Button>
  );
};
