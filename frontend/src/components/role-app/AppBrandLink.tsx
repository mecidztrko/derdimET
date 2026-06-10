import { NavLink } from 'react-router-dom'
import { brandLogoUrl } from '../../lib/brandAssets'
import { cn } from '../../lib/cn'

type AppBrandLinkProps = {
  onNavigate?: () => void
  className?: string
}

/** Ana panel üst çubuğu — sol üst marka (`public/logo.svg`). */
export function AppBrandLink({ onNavigate, className }: AppBrandLinkProps) {
  return (
    <NavLink
      to="/role-selector"
      className={cn('flex shrink-0 items-center', className)}
      onClick={onNavigate}
      aria-label="derdimET ana sayfa"
    >
      <img
        src={brandLogoUrl('svg')}
        alt="derdimET"
        className="h-9 w-auto max-w-[11rem] object-contain object-left sm:max-w-[10.5rem]"
      />
    </NavLink>
  )
}
