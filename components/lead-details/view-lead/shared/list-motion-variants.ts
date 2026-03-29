import { Variants, MotionProps } from "motion/react";
import { CARD_MOTION_TRANSITION } from "@/components/lead-details/view-lead/notes/lib/constants";

const LIST_OUTER_MOTION_VARIANTS: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: { height: "auto", opacity: 1 },
  exit: { height: 0, opacity: 0 },
};
const LIST_INNER_MOTION_VARIANTS: Variants = {
  initial: {
    opacity: 0,
    y: -8,
    scale: 0.2,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.2,
    filter: "blur(4px)",
  },
};

export const LIST_OUTER_MOTION_PROPS = {
  variants: LIST_OUTER_MOTION_VARIANTS,
  initial: "initial",
  animate: "animate",
  exit: "exit",
  transition: CARD_MOTION_TRANSITION,
} satisfies MotionProps;

export const LIST_INNER_MOTION_PROPS = {
  variants: LIST_INNER_MOTION_VARIANTS,
  initial: "initial",
  animate: "animate",
  exit: "exit",
  transition: CARD_MOTION_TRANSITION,
} satisfies MotionProps;
