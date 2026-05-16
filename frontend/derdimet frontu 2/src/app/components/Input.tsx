import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasValue(e.target.value !== '');
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          className={cn(
            'w-full h-12 px-4 pt-3 pb-1 bg-input-background border-[1.5px] border-border rounded-[var(--radius-input)] transition-all outline-none',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            className
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused || hasValue ? props.placeholder : ''}
          {...props}
        />
        {label && (
          <label
            className={cn(
              'absolute left-4 transition-all pointer-events-none text-muted-foreground',
              isFocused || hasValue || props.value || props.defaultValue
                ? 'top-1.5 text-caption'
                : 'top-3 text-small'
            )}
          >
            {label}
          </label>
        )}
        {error && (
          <p className="mt-1 text-caption text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
