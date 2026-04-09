"use client";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/feedback/alert";
import { AlertCircle } from "lucide-react";
import {
  Container,
  type ContainerProps,
} from "@/components/ui/layout/containers";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  Variants,
  Transition,
} from "motion/react";
import { cn } from "@/lib/utils";

// ============================================================
// Types
// ============================================================

export type FormErrors = Record<string, string | undefined>;

export interface FormMotionAlertContainerProps {
  error?: string | FormErrors;
  alertProps?: {
    id?: string;
    title?: string;
    spacing?: ContainerProps["spacing"];
  };

  children: React.ReactNode;
  spacing?: ContainerProps["spacing"];
  containerProps?: Omit<ContainerProps, "spacing">;
}

// ============================================================
// Utilities
// ============================================================

function getErrorMessages(error?: string | FormErrors): string[] {
  if (!error) return [];
  if (typeof error === "string") return [error];
  return Object.values(error).filter(Boolean) as string[];
}
// ============================================================
// Motion Variants
// ============================================================

const alertVariants: Variants = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};
const listVariants: Variants = {
  initial: { opacity: 0, filter: "blur(4px)", scale: 0.95 },
  animate: { opacity: 1, filter: "blur(0px)", scale: 1 },
  exit: { opacity: 0, filter: "blur(4px)", scale: 0.95 },
};

const transition: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

// ============================================================
// FormMotionAlertContainer
// ============================================================

export const FormMotionAlertContainer = ({
  error,
  alertProps,
  children,
  spacing = "group",
  containerProps,
}: FormMotionAlertContainerProps) => {
  const messages = getErrorMessages(error);

  const hasMessages = messages.length > 0;
  const hasTitle = alertProps?.title;

  return (
    <MotionConfig transition={transition}>
      <motion.div layout="position">
        <AnimatePresence>
          {hasMessages && (
            <motion.div
              key="error-alert"
              variants={alertVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="overflow-hidden"
            >
              <Container spacing={alertProps?.spacing ?? "block"}>
                <Alert variant="brand" aria-live="polite" id={alertProps?.id}>
                  {hasTitle && <AlertTitle>{alertProps.title}</AlertTitle>}
                  <ul
                    className={cn("space-y-2", {
                      "mt-2 pl-4": hasTitle,
                    })}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      {messages.map((message) => (
                        <motion.li
                          key={message}
                          variants={listVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="overflow-hidden flex items-center gap-2 text-sm"
                        >
                          <AlertCircle className="size-4" aria-hidden="true" />
                          {message}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </Alert>
                <div aria-hidden="true" />
              </Container>
            </motion.div>
          )}
        </AnimatePresence>
        <Container spacing={spacing} {...containerProps}>
          {children}
        </Container>
      </motion.div>
    </MotionConfig>
  );
};
