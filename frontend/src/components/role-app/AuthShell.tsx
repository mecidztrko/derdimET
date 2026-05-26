import type { ReactNode } from 'react'

type AuthShellProps = {
  title: string
  subtitle?: string
  children: ReactNode
}

/** Giriş / kayıt — tam ekran hero arka plan + cam kart */
export function AuthShell({ title, subtitle, children }: AuthShellProps) {
  return (
    <div className="auth-bg relative z-0 flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/40 bg-white/72 p-8 shadow-card backdrop-blur-md">
        <h1 className="font-display text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle ? <p className="mt-1 mb-6 text-sm text-gray-500">{subtitle}</p> : <div className="mb-6" />}
        {children}
      </div>
    </div>
  )
}
