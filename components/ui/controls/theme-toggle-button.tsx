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
  const ariaLabel = `Switch to ${isDark ? "light" : "dark"} mode`;

  return (
    <div
      className={className}
      style={{ visibility: mounted ? "visible" : "hidden" }}
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
            {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </Button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export { ThemeToggleButton };
