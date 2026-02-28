'use client';
import { ReactNode, AriaAttributes } from 'react';
import { AnimatePresence, type Transition, type Variants } from 'motion/react';
import * as motion from 'motion/react-client';
import { fadeScaleMotion } from '@/lib/variants/motion-variants';

interface AnimatedContentSwapProps extends AriaAttributes {
  /** Whether the Swap is in the "open" state */
  isActive: boolean;
  /** Content to show when collapsed/closed */
  from?: ReactNode;
  /** Content to show when expanded/open */
  to?: ReactNode;
  /** Custom motion variants (defaults to fadeScaleMotion) */
  variants?: Variants;
  /** Custom transition properties */
  transition?: Transition;
  /** Key prefix for AnimatePresence (defaults to "Swap") */
  keyPrefix?: string;
  /** AnimatePresence mode (defaults to "wait") */
  mode?: 'sync' | 'wait' | 'popLayout';
  /** Additional className for the motion wrapper */
  className?: string;
  /** Callback when "to" animation starts */
  onToAnimationStart?: () => void;
  /** Callback when "from" animation completes */
  onFromAnimationComplete?: () => void;
  /** HTML id attribute */
  id?: string;
  /** HTML role attribute */
  role?: string;
  /** HTML tabIndex attribute */
  tabIndex?: number;
}

/**
 * AnimatedSwap - A reusable component for toggling between two states with animation
 *
 * @example
 * ```tsx
 * <AnimatedSwap
 *   isOpen={isSidebarOpen}
 *   from={<Icon icon="menu" />}
 *   to={<Icon icon="x" />}
 * />
 * ```
 */
function AnimatedContentSwap({
  isActive,
  from = '...',
  to,
  variants = fadeScaleMotion,
  transition,
  keyPrefix = 'Swap',
  mode = 'wait',
  className,
  onToAnimationStart,
  onFromAnimationComplete,
  ...htmlProps
}: AnimatedContentSwapProps) {
  const content = isActive ? to : from;
  const key = `${keyPrefix}-${isActive ? 'to' : 'from'}`;
  const animationCallbacks = isActive
    ? { onAnimationStart: onToAnimationStart }
    : { onAnimationComplete: onFromAnimationComplete };

  return (
    <AnimatePresence mode={mode} initial={false}>
      <motion.div
        key={key}
        {...variants}
        transition={transition}
        className={className}
        {...animationCallbacks}
        {...htmlProps}
      >
        {content}
      </motion.div>
    </AnimatePresence>
  );
}

export { AnimatedContentSwap };
