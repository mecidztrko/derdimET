import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const chipVariants = cva(
  'inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-chip)] px-4 py-2 text-small transition-all cursor-pointer select-none',
  {
    variants: {
      variant: {
        default: 'bg-muted text-foreground hover:bg-muted/80',
        selected: 'bg-primary-soft text-foreground',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        outline: 'border-[1.5px] border-border bg-transparent hover:bg-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ChipProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chipVariants> {
  selected?: boolean;
}

const Chip = forwardRef<HTMLDivElement, ChipProps>(
  ({ className, variant, selected, ...props }, ref) => {
    return (
      <div
        className={cn(chipVariants({ variant: selected ? 'selected' : variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Chip.displayName = 'Chip';

export { Chip, chipVariants };
