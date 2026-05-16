import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
}

const pad = { sm: 'p-4', md: 'p-6', lg: 'p-8' }

export function Card({ children, className = '', padding = 'md' }: Props) {
  return (
    <div
      className={`rounded-2xl border border-gray-100/90 bg-white/90 shadow-card backdrop-blur-sm transition-shadow duration-300 hover:shadow-card-hover ${pad[padding]} ${className}`}
    >
      {children}
    </div>
  )
}
