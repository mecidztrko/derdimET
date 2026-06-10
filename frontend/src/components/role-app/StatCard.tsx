import type { LucideIcon } from 'lucide-react'
import { Card } from './Card'
import { cn } from '../../lib/cn'

type StatAccent = 'primary' | 'secondary' | 'accent' | 'success'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  accent?: StatAccent
  className?: string
}

const accentStyles: Record<
  StatAccent,
  { bar: string; icon: string; glow: string }
> = {
  primary: {
    bar: 'from-primary to-accent',
    icon: 'from-primary-soft to-primary/15 text-primary ring-primary/20',
    glow: 'bg-primary/20',
  },
  secondary: {
    bar: 'from-secondary to-teal-400',
    icon: 'from-secondary/15 to-secondary/5 text-secondary ring-secondary/25',
    glow: 'bg-secondary/20',
  },
  accent: {
    bar: 'from-accent to-primary',
    icon: 'from-accent/15 to-primary/10 text-accent ring-accent/20',
    glow: 'bg-accent/20',
  },
  success: {
    bar: 'from-success to-emerald-400',
    icon: 'from-success/15 to-success/5 text-success ring-success/20',
    glow: 'bg-success/20',
  },
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  accent = 'primary',
  className,
}: StatCardProps) {
  const styles = accentStyles[accent]

  return (
    <Card elevation="hover" className={cn('relative overflow-hidden', className)}>
      <div
        className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', styles.bar)}
        aria-hidden
      />
      <div
        className={cn(
          'pointer-events-none absolute -right-6 -top-6 size-24 rounded-full blur-2xl',
          styles.glow,
        )}
        aria-hidden
      />

      <div className="relative flex items-start justify-between pt-1">
        <div className="flex-1">
          <p className="mb-1.5 text-small font-medium text-muted-foreground">{title}</p>
          <p className="font-heading text-[2rem] font-semibold leading-none tracking-tight text-foreground">
            {value}
          </p>
          {trend ? (
            <p
              className={cn(
                'mt-2 text-caption font-medium',
                trend.positive ? 'text-secondary' : 'text-destructive',
              )}
            >
              {trend.value}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            'flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ring-1 shadow-sm',
            styles.icon,
          )}
        >
          <Icon className="size-6" />
        </div>
      </div>
    </Card>
  )
}
