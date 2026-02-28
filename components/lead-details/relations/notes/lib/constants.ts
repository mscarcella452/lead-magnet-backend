import { type Transition } from "motion/react";

// ============================================================================
// Constants
// ============================================================================

export const CARD_MOTION_TRANSITION: Transition = {
  //   duration: 0.3,
  //   ease: "easeInOut",
  type: "spring",
  stiffness: 180,
  damping: 25,
};
export const PIN_ICON_TRANSITION: Transition = { duration: 0.15 };
