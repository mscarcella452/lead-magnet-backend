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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const isDark = isMounted && theme === "dark";
  const ariaLabel = isMounted
    ? `Switch to ${isDark ? "light" : "dark"} mode`
    : "Theme toggle";

  return (
    <div
      className={className}
      style={{ visibility: isMounted ? "visible" : "hidden" }}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={theme}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            onClick={handleToggleTheme}
            size="sm"
            mode="iconOnly"
            aria-label={ariaLabel}
            {...props}
          >
            {isMounted ? (
              isDark ? (
                <Sun aria-hidden="true" />
              ) : (
                <Moon aria-hidden="true" />
              )
            ) : (
              <Sun aria-hidden="true" />
            )}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export { ThemeToggleButton };
