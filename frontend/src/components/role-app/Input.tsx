import { InputHTMLAttributes, forwardRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: LucideIcon
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, icon: Icon, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(e.target.value !== '')
    }

    return (
      <div className="relative w-full">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
        )}
        <input
          type={type}
          className={cn(
            'w-full h-12 bg-input-background border-[1.5px] border-border rounded-input transition-all outline-none',
            Icon ? 'pl-11 pr-4' : 'px-4',
            label ? 'pt-3 pb-1' : '',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            className,
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused || hasValue || !label ? props.placeholder : ''}
          {...props}
        />
        {label && (
          <label
            className={cn(
              'absolute transition-all pointer-events-none text-muted-foreground',
              Icon ? 'left-11' : 'left-4',
              isFocused || hasValue || props.value || props.defaultValue
                ? 'top-1.5 text-caption'
                : 'top-3 text-small',
            )}
          >
            {label}
          </label>
        )}
        {error && <p className="mt-1 text-caption text-destructive">{error}</p>}
      </div>
    )
  },
)

Input.displayName = 'Input'

export { Input }
