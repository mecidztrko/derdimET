import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type PageHeroProps = {
  title: ReactNode
  description?: ReactNode
  /** Üst etiket — örn. "Satıcı paneli" */
  eyebrow?: string
  actions?: ReactNode
  className?: string
}

/** Kurumsal panel — gradient vurgulu sayfa başlığı. */
export function PageHero({ title, description, eyebrow, actions, className }: PageHeroProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="role-app-hero-panel relative overflow-hidden rounded-card border border-border/70 bg-card/85 shadow-soft backdrop-blur-sm">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-secondary/[0.06]" />
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 size-56 rounded-full bg-secondary/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-0 role-app-dot-grid opacity-40" />

        <div className="relative flex flex-wrap items-end justify-between gap-4 p-6 sm:p-8">
          <div className="min-w-0 flex-1">
            {eyebrow ? (
              <p className="mb-3 inline-flex items-center rounded-full border border-primary/25 bg-primary/[0.06] px-3 py-1 text-caption font-semibold tracking-wide text-primary">
                {eyebrow}
              </p>
            ) : null}
            <h1 className="role-app-page-title mb-2">{title}</h1>
            {description ? (
              <div className="max-w-2xl text-muted-foreground">{description}</div>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
        </div>

        <div
          className="h-1 w-full bg-gradient-to-r from-primary via-[rgb(var(--accent))] to-secondary"
          aria-hidden
        />
      </div>
    </div>
  )
}
