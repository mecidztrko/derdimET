import type { ReactNode } from 'react'

type Props = {
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-clinical-50/30 px-6 py-14 text-center">
      <div className="mb-4 text-clinical-300" aria-hidden>
        <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 120 100" stroke="currentColor" strokeWidth="1.2">
          <rect x="15" y="25" width="90" height="50" rx="8" className="fill-white/80" />
          <path d="M35 45h50M35 55h35" strokeLinecap="round" className="opacity-5 text-gray-400" stroke="currentColor" />
          <circle cx="85" cy="38" r="6" className="fill-clinical-100 stroke-clinical-300" />
        </svg>
      </div>
      <p className="font-display text-base font-semibold text-gray-800">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
