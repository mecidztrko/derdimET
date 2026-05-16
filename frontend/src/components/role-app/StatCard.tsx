import type { LucideIcon } from 'lucide-react'
import { Card } from './Card'
import { cn } from '../../lib/cn'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    positive: boolean
  }
  className?: string
}

export function StatCard({ title, value, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card elevation="soft" className={cn('', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-small text-muted-foreground mb-1">{title}</p>
          <p className="text-[2rem] font-semibold font-heading leading-none">{value}</p>
          {trend && (
            <p
              className={cn(
                'text-caption mt-2',
                trend.positive ? 'text-secondary' : 'text-destructive',
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        <div className="size-12 rounded-xl bg-primary-soft flex items-center justify-center">
          <Icon className="size-6 text-primary" />
        </div>
      </div>
    </Card>
  )
}
