import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface EmailCardProps extends VariantProps<typeof emailCardVariants> {
  children: React.ReactNode;
  className?: string;
}

const emailCardVariants = cva("", {
  variants: {
    border: {
      true: "border",
      false: "",
    },
    variant: {
      card: "bg-card border-border-soft",
      panel: "bg-panel border-card",
      muted: "bg-muted border-border",
      outline: "border border-border-soft",
    },
    size: {
      sm: "px-2 py-1",
      md: "px-3 py-2",
      lg: "px-4 py-3",
      none: "",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "panel",
    border: false,
  },
});

export const EmailCard = ({
  variant,
  size,
  border,
  children,
  className,
  ...props
}: EmailCardProps) => {
  return (
    <div
      className={cn(
        emailCardVariants({ variant, size, border }),
        "rounded-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

interface EmailInfoCardProps extends Omit<EmailCardProps, "children"> {
  label: string;
  value: string;
}

export const EmailInfoCard = ({
  label,
  value,
  ...props
}: EmailInfoCardProps) => {
  return (
    <EmailCard border {...props}>
      <p className="text-subtle-foreground text-xs tracking-wide mb-1">
        {label}
      </p>
      <p className="text-base font-semibold">{value}</p>
    </EmailCard>
  );
};
