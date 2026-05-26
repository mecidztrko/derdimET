import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { BRAND_LOGO_FALLBACK, brandLogoUrl } from '../../lib/brandAssets'
import { cn } from '../../lib/cn'

type AppBrandLinkProps = {
  onNavigate?: () => void
  className?: string
}

/** Ana panel üst çubuğu — sol üst marka (logo.png varsa onu, yoksa logo.svg). */
export function AppBrandLink({ onNavigate, className }: AppBrandLinkProps) {
  const [src, setSrc] = useState(() => brandLogoUrl('png'))

  return (
    <NavLink
      to="/role-selector"
      className={cn('flex shrink-0 items-center', className)}
      onClick={onNavigate}
      aria-label="derdimET ana sayfa"
    >
      <img
        src={src}
        alt="derdimET"
        className="h-9 w-auto max-w-[11rem] object-contain object-left sm:max-w-[10.5rem]"
        onError={() => {
          if (src !== BRAND_LOGO_FALLBACK) setSrc(BRAND_LOGO_FALLBACK)
        }}
      />
    </NavLink>
  )
}
