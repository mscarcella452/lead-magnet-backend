"use client";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "motion/react";
import { Button, ButtonProps } from "@/components/ui/controls/button";
import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/classnames";

interface ThemeToggleButtonProps extends Omit<
  ButtonProps,
  "aria-label" | "onClick" | "children"
> {}

export function ThemeToggleButton({ ...props }: ThemeToggleButtonProps) {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <Button
      onClick={handleToggleTheme}
      mode="iconOnly"
      aria-label="Toggle theme"
      className="relative"
      {...props}
    >
      <IconDisplay resolvedTheme={resolvedTheme} />
    </Button>
  );
}

const IconDisplay = ({
  resolvedTheme,
}: {
  resolvedTheme: string | undefined;
}) => {
  const isDark = resolvedTheme === "dark";
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={resolvedTheme}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.4 }}
      >
        {isDark ? <Moon aria-hidden="true" /> : <Sun aria-hidden="true" />}
      </motion.span>
    </AnimatePresence>
  );
};
