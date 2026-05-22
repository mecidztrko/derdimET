import { useMemo, useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Menu, Home, Package, TrendingUp, Eye, MessageCircle, Settings } from 'lucide-react'
import { Button } from '../components/role-app/Button'
import { LayoutSearchBar } from '../components/role-app/LayoutSearchBar'
import { LayoutUserBar } from '../components/role-app/LayoutUserBar'
import { RoleAppSidebar, type SidebarNavItem } from '../components/role-app/RoleAppSidebar'
import { isSellerRouteEnabled, type SellerFeature } from '../config/routeFeatures'
import { useSellerPendingCounts } from '../hooks/usePendingCounts'
import { NotificationBell } from '../components/role-app/NotificationBell'
import { EmailVerificationBanner } from '../components/role-app/EmailVerificationBanner'

type NavDef = SidebarNavItem & { feature: SellerFeature }

const navigation: NavDef[] = [
  { name: 'Pazar Durumu', href: '/seller', icon: Home, end: true, feature: 'home' },
  { name: 'İlanlarım', href: '/seller/listings', icon: Package, feature: 'listings' },
  { name: 'Teklifler', href: '/seller/offers', icon: TrendingUp, feature: 'offers' },
  { name: 'İncele', href: '/seller/browse', icon: Eye, feature: 'browse' },
  { name: 'Mesajlar', href: '/seller/messages', icon: MessageCircle, feature: 'messages' },
  { name: 'Profil & Ayarlar', href: '/seller/settings', icon: Settings, feature: 'settings' },
]

export function SellerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pendingIncoming } = useSellerPendingCounts()
  const visibleNav = useMemo(
    () =>
      navigation
        .filter((item) => isSellerRouteEnabled(item.feature))
        .map(({ feature: _f, ...item }) => ({
          ...item,
          badge: item.href === '/seller/offers' ? pendingIncoming : undefined,
        })),
    [pendingIncoming],
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

          <LayoutSearchBar
            targets={[
              { path: '/seller/browse', placeholder: 'Pazar ilanları ara...' },
              { path: '/seller', placeholder: 'Kesimhane alış talebi ara...', exact: true },
            ]}
            fallback={{ path: '/seller/browse', placeholder: 'Pazar ilanları ara...' }}
          />

          <div className="flex items-center gap-2 flex-shrink-0">
            <NotificationBell />
            <LayoutUserBar role="ANIMAL_SELLER" settingsPath="/seller/settings" />
          </div>
        </div>
      </nav>

      <div className="flex max-w-[1440px] mx-auto">
        <RoleAppSidebar
          items={visibleNav}
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          activeClassName="bg-secondary/10 text-foreground before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-secondary before:rounded-r"
        />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
