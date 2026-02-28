"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button, ButtonProps } from "@/components/ui/controls/button";
import { Sun, Moon } from "lucide-react";

// ============================================================================
// Theme Toggle Component -- Dark/light theme switcher with animated icon transition
// ============================================================================

interface ThemeToggleButtonProps extends Omit<
  ButtonProps,
  "className" | "aria-label" | "onClick" | "children"
> {
  className?: string;
}

function ThemeToggleButton({ className, ...props }: ThemeToggleButtonProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;
  const ariaLabel = `Switch to ${isDark ? "light" : "dark"} mode`;

  return (
    <>
      <AnimatePresence mode="popLayout">
        {mounted ? (
          <motion.div
            key={theme}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.4 }}
            className={className}
          >
            <Button
              onClick={handleToggleTheme}
              size="sm"
              mode="iconOnly"
              aria-label={ariaLabel}
              {...props}
            >
              <Icon aria-hidden="true" />
            </Button>
          </motion.div>
        ) : (
          <div className="size-8" aria-hidden="true" />
        )}
      </AnimatePresence>
    </>
  );
}

export { ThemeToggleButton };
