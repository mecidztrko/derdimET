import type { ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { Button } from './Button'
import { RoleAppSidebar, type SidebarNavItem } from './RoleAppSidebar'
import { EmailVerificationBanner } from './EmailVerificationBanner'
import { AppBrandLink } from './AppBrandLink'
type RoleAppShellProps = {
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
  sidebarItems: SidebarNavItem[]
  activeClassName: string
  searchBar: ReactNode
  userBar: ReactNode
  children: ReactNode
}

/** Alıcı / satıcı / kesimhane — üst bar + yan menü + kaydırılabilir ana alan (tam ekran). */
export function RoleAppShell({
  mobileOpen,
  onMobileOpenChange,
  sidebarItems,
  activeClassName,
  searchBar,
  userBar,
  children,
}: RoleAppShellProps) {
  const closeMobile = () => onMobileOpenChange(false)

  return (
    <div className="role-app flex h-dvh max-h-dvh flex-col">
      <EmailVerificationBanner />
      <header className="relative z-50 shrink-0 border-b border-border/80 bg-card/90 shadow-header backdrop-blur-md">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-primary via-accent to-secondary opacity-90"
          aria-hidden
        />
        <div className="flex h-[4.25rem] w-full min-w-0 items-center gap-2 px-4 sm:px-6">
          <div className="flex min-w-0 shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              type="button"
              aria-label="Menü"
              onClick={() => onMobileOpenChange(!mobileOpen)}
            >
              <Menu className="size-5" />
            </Button>
            <AppBrandLink onNavigate={closeMobile} />
          </div>
          {searchBar}
          <div className="relative z-[60] ml-auto flex shrink-0 items-center gap-1 sm:gap-2">{userBar}</div>
        </div>
      </header>

      <div className="flex min-h-0 w-full flex-1 overflow-hidden">
        <RoleAppSidebar
          items={sidebarItems}
          mobileOpen={mobileOpen}
          onMobileClose={closeMobile}
          activeClassName={activeClassName}
        />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">{children}</main>
      </div>
    </div>
  )
}
