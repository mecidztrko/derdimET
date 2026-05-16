import { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md px-2.5 py-0.5 text-caption font-medium transition-colors',
  {
    variants: {
      variant: {
        open: 'bg-secondary/10 text-secondary border border-secondary/20',
        closed: 'bg-muted text-muted-foreground border border-border',
        pending: 'bg-accent/10 text-accent border border-accent/20',
        accepted: 'bg-secondary/10 text-secondary border border-secondary/20',
        rejected: 'bg-primary/10 text-primary border border-primary/20',
        default: 'bg-primary text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        className={cn(badgeVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge, badgeVariants };
