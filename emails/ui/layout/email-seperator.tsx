import { cn } from "@/lib/utils";
import { Hr } from "@react-email/components";

export const EmailSeperator = ({
  className,
  orientation = "horizontal",
}: {
  className?: string;
  orientation?: "horizontal" | "vertical";
}) => {
  const orientationClassName =
    orientation === "horizontal" ? "w-full" : "w-px h-full";
  return (
    <Hr className={cn("bg-border-soft", orientationClassName, className)} />
  );
};
