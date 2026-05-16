import type { ReactNode } from 'react'

type Variant = 'active' | 'sold' | 'pending' | 'neutral' | 'success' | 'role'

const styles: Record<Variant, string> = {
  active: 'bg-emerald-50 text-emerald-800 ring-emerald-100',
  sold: 'bg-gray-100 text-gray-700 ring-gray-200',
  pending: 'bg-amber-50 text-amber-900 ring-amber-100',
  neutral: 'bg-gray-50 text-gray-600 ring-gray-100',
  success: 'bg-clinical-50 text-clinical-800 ring-clinical-100',
  role: 'bg-clinical-600 text-white ring-0 shadow-sm',
}

export function Badge({ children, variant = 'neutral' }: { children: ReactNode; variant?: Variant }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles[variant]}`}
    >
      {children}
    </span>
  )
}
