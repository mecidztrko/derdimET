import type { ReactNode } from 'react'

type AuthShellProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

/** Giriş / kayıt sayfaları için Figma role-app teması */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="role-app min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <p className="text-center font-display text-2xl font-semibold text-primary mb-1">derdimET</p>
        <p className="text-center text-caption text-muted-foreground mb-8">Et ve hayvan ticareti platformu</p>
        <div className="rounded-[var(--radius-card)] border border-border bg-card p-8 shadow-[var(--shadow-card)]">
          <h1 className="text-h3 font-semibold mb-1">{title}</h1>
          {subtitle ? <p className="text-small text-muted-foreground mb-6">{subtitle}</p> : null}
          {children}
        </div>
      </div>
    </div>
  )
}
