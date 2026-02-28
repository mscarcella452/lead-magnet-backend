import { cn } from "@/lib/utils/classnames";

interface InsetProps {
  children: React.ReactNode;
  className?: string;
  variant?: "section" | "hero" | "footer" | "drawer" | "content";
  as?: keyof JSX.IntrinsicElements;
  id?: string;
}

const Inset = ({
  children,
  className,
  variant = "section",
  as: Component = "div",
  id,
}: InsetProps) => (
  <Component
    id={id}
    className={cn(
      "px-6 sm:px-8 scroll-navbar-top",
      {
        "py-16 md:py-32": variant === "section",
        "py-16 md:pt-20 md:pb-32": variant === "hero",
        "py-8 md:py-16": variant === "footer" || variant === "drawer",
        "py-6 md:py-10": variant === "content",
      },
      className,
    )}
  >
    {children}
  </Component>
);

export { Inset };
