/**
 * Motion variants for Framer Motion animations
 * Used across the application for consistent animation patterns
 */

import { Variants } from "motion/react";

export const fadeScaleMotion: Variants = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
};

export const subtleScaleMotion: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

type FadeOptions =
  | { axis: "x" | "y"; distance: number } // both required
  | { axis?: undefined; distance?: undefined }; // or neither

export const fadeMotion = ({ axis, distance }: FadeOptions = {}): Variants => ({
  initial: {
    opacity: 0,
    ...(axis && { [axis]: distance }),
  },
  animate: {
    opacity: 1,
    ...(axis && { [axis]: 0 }),
  },
  exit: {
    opacity: 0,
    ...(axis && { [axis]: distance }),
  },
});

type BlurFadeOptions =
  | {
      axis?:
        | "x"
        | "y"
        | {
            enter: "x" | "y";
            exit: "x" | "y";
          };
      distance?:
        | number
        | string
        | { enter: number | string; exit: number | string };
    } // both required
  | { axis?: undefined; distance?: undefined }; // or neither

export const blurFadeMotion = ({
  axis,
  distance,
}: BlurFadeOptions = {}): Variants => {
  const enterAxis = typeof axis === "object" ? axis.enter : axis;
  const exitAxis = typeof axis === "object" ? axis.exit : axis;

  const enterDistance =
    typeof distance === "object" ? distance.enter : (distance ?? 100);

  const exitDistance =
    typeof distance === "object" ? distance.exit : (distance ?? 100);

  const defaultMotion: {
    opacity: number;
    filter: string;
    x?: number | string;
    y?: number | string;
  } = {
    opacity: 0,
    filter: "blur(6px)",
  };

  if (enterAxis) defaultMotion[enterAxis] = enterDistance;
  if (exitAxis) defaultMotion[exitAxis] = exitDistance;

  return {
    initial: defaultMotion,
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      ...(enterAxis && { [enterAxis]: 0 }),
    },
    exit: {
      ...defaultMotion,
      ...(exitAxis && { [exitAxis]: exitDistance }),
    },
  };
};

export const sidebarSwapMotion: Variants = {
  initial: { opacity: 0, y: -30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -30 },
};
