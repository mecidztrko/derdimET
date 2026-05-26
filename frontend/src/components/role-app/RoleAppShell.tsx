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
    <div className="role-app flex h-dvh max-h-dvh flex-col overflow-hidden bg-background">
      <EmailVerificationBanner />
      <header className="z-50 shrink-0 border-b border-border bg-card">
        <div className="flex h-16 w-full items-center justify-between gap-2 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
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
          <div className="flex shrink-0 items-center gap-2">{userBar}</div>
        </div>
      </header>

      <div className="flex min-h-0 w-full flex-1">
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
