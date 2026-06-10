import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type RoleAppPageProps = {
  children: ReactNode
  className?: string
  /** Mesajlar gibi tam yükseklik sayfalar için */
  fill?: boolean
}

/** Ana panel içerik alanı — viewport genişliğine yayılır, kaydırma üst layout’ta. */
export function RoleAppPage({ children, className, fill }: RoleAppPageProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8',
        fill && 'flex min-h-0 flex-1 flex-col',
        className,
      )}
    >
      {children}
    </div>
  )
}
