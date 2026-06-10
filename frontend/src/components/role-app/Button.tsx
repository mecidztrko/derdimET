import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-b from-[rgb(37,99,235)] to-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 hover:brightness-[1.04] active:brightness-95',
        secondary:
          'border-[1.5px] border-primary/80 text-primary bg-card hover:bg-primary-soft hover:border-primary',
        tertiary: 'text-primary hover:underline',
        ghost: 'hover:bg-muted',
        outline: 'border-[1.5px] border-border bg-transparent hover:bg-muted',
      },
      size: {
        default: 'h-12 px-6 rounded-button',
        sm: 'h-10 px-4 rounded-button',
        lg: 'h-14 px-8 rounded-button',
        icon: 'size-12 rounded-button',
        'icon-sm': 'size-9 rounded-button',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'

export { Button, buttonVariants }
