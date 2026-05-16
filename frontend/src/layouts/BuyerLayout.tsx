import { useState, useMemo } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Menu, Home, ListFilter, TrendingUp, Heart, MessageCircle, Settings } from 'lucide-react'
import { Button } from '../components/role-app/Button'
import { LayoutSearchBar } from '../components/role-app/LayoutSearchBar'
import { LayoutUserBar } from '../components/role-app/LayoutUserBar'
import { RoleAppSidebar, type SidebarNavItem } from '../components/role-app/RoleAppSidebar'
import { isBuyerRouteEnabled, type BuyerFeature } from '../config/routeFeatures'
import { useBuyerPendingCounts } from '../hooks/usePendingCounts'
import { NotificationBell } from '../components/role-app/NotificationBell'
import { EmailVerificationBanner } from '../components/role-app/EmailVerificationBanner'

type NavDef = SidebarNavItem & { feature: BuyerFeature }

const navigation: NavDef[] = [
  { name: 'Ana Sayfa', href: '/buyer', icon: Home, end: true, feature: 'home' },
  { name: 'Ara', href: '/buyer/search', icon: ListFilter, feature: 'search' },
  { name: 'Tekliflerim', href: '/buyer/offers', icon: TrendingUp, feature: 'offers' },
  { name: 'Favoriler', href: '/buyer/favorites', icon: Heart, feature: 'favorites' },
  { name: 'Mesajlar', href: '/buyer/messages', icon: MessageCircle, feature: 'messages' },
  { name: 'Ayarlar', href: '/buyer/settings', icon: Settings, feature: 'settings' },
]

export function BuyerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pendingOffers } = useBuyerPendingCounts()
  const visibleNav = useMemo(
    () =>
      navigation
        .filter((item) => isBuyerRouteEnabled(item.feature))
        .map(({ feature: _f, ...item }) => ({
          ...item,
          badge: item.href === '/buyer/offers' ? pendingOffers : undefined,
        })),
    [pendingOffers],
  )

  return (
    <div className="role-app min-h-screen bg-background">
      <EmailVerificationBanner />
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              type="button"
              aria-label="Menü"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <Menu className="size-5" />
            </Button>
            <NavLink to="/role-selector" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">dE</span>
              </div>
              <span className="font-heading font-semibold text-lg hidden sm:block">derdimET</span>
            </NavLink>
          </div>

          <LayoutSearchBar searchPath="/buyer/search" placeholder="Et ürünleri ara..." />

          <div className="flex items-center gap-2 flex-shrink-0">
            <NotificationBell />
            <LayoutUserBar role="MEAT_BUYER" settingsPath="/buyer/settings" />
          </div>
        </div>
      </nav>

      <div className="flex max-w-[1440px] mx-auto">
        <RoleAppSidebar
          items={visibleNav}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          activeClassName="bg-primary-soft text-foreground before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-r"
        />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
