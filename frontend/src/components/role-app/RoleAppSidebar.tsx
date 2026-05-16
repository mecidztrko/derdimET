import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

export type SidebarNavItem = {
  name: string
  href: string
  icon: LucideIcon
  end?: boolean
  badge?: number
}

type RoleAppSidebarProps = {
  items: SidebarNavItem[]
  mobileOpen: boolean
  onMobileClose: () => void
  activeClassName: string
}

export function RoleAppSidebar({
  items,
  mobileOpen,
  onMobileClose,
  activeClassName,
}: RoleAppSidebarProps) {
  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          aria-label="Menüyü kapat"
          onClick={onMobileClose}
        />
      ) : null}

      <aside
        className={cn(
          'w-64 border-r border-border bg-card z-40 p-4',
          'fixed left-0 top-16 bottom-0 transition-transform duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <nav className="space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.end}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium transition-colors relative',
                  isActive ? activeClassName : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <item.icon className="size-5 flex-shrink-0" />
              <span className="flex-1">{item.name}</span>
              {item.badge != null && item.badge > 0 ? (
                <span className="min-w-[1.25rem] h-5 px-1.5 rounded-full bg-destructive text-destructive-foreground text-caption font-medium flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
