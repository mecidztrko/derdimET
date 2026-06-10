import { NavLink } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { LogoutButton } from './LogoutButton'

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
          'z-40 flex w-64 shrink-0 flex-col border-r border-border/80 bg-card/80 p-4 backdrop-blur-md',
          'fixed left-0 top-[4.25rem] bottom-0 transition-transform duration-200',
          'lg:relative lg:top-auto lg:bottom-auto lg:left-auto lg:h-auto lg:max-h-full lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        <p className="mb-3 px-3 text-caption font-semibold uppercase tracking-wider text-muted-foreground/80">
          Menü
        </p>
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto">
          {items.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.end}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-small font-medium transition-all relative',
                  isActive
                    ? activeClassName
                    : 'text-muted-foreground hover:bg-card hover:text-foreground hover:shadow-sm',
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
        <div className="mt-4 shrink-0 border-t border-border pt-4">
          <LogoutButton placement="sidebar" />
        </div>
      </aside>
    </>
  )
}
