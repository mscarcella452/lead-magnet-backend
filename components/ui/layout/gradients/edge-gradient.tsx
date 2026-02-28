import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/classnames';

// =========================================================================
// Edge Gradient Component -- Reusable gradient overlay for fading edges
// =========================================================================
const edgeGradientVariants = cva(
  'absolute z-10 from-background to-transparent pointer-events-none',
  {
    variants: {
      direction: {
        top: 'top-0 left-0 right-0 h-16 bg-gradient-to-b',
        bottom: 'bottom-0 left-0 right-0 h-16 bg-gradient-to-t',
        left: 'inset-y-0 left-0 w-24 bg-gradient-to-r',
        right: 'inset-y-0 right-0 w-24 bg-gradient-to-l',
      },
    },
    defaultVariants: {
      direction: 'top',
    },
  }
);

export interface EdgeGradientProps extends VariantProps<
  typeof edgeGradientVariants
> {
  className?: string;
}

export function EdgeGradient({ direction, className }: EdgeGradientProps) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn(edgeGradientVariants({ direction }), className)}
    />
  );
}
