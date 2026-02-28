import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================================================
// cn

// - Utility for conditionally joining Tailwind CSS classes
// - Combines clsx and tailwind-merge for optimal class handling
// ============================================================================

export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...inputs));
}

// ============================================================================
// hasClass

// - Utility for checking if a Tailwind CSS class exists in a className string
// - Returns true if the target class is present, false otherwise
// ============================================================================

export function hasClass(
  className: string | undefined,
  targetClass: string
): boolean {
  if (!className) return false;
  return className.split(/\s+/).includes(targetClass);
}
