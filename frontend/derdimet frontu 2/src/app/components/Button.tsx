import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:shadow-[var(--shadow-hover)]',
        secondary: 'border-[1.5px] border-primary text-primary bg-transparent hover:bg-primary-soft',
        tertiary: 'text-primary hover:underline',
        ghost: 'hover:bg-muted',
      },
      size: {
        default: 'h-12 px-6 rounded-[var(--radius-button)]',
        sm: 'h-10 px-4 rounded-[var(--radius-button)]',
        lg: 'h-14 px-8 rounded-[var(--radius-button)]',
        icon: 'size-12 rounded-[var(--radius-button)]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
