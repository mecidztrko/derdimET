import { useMemo, useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  Menu,
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Package,
  TrendingUp,
  MessageCircle,
  Settings,
} from 'lucide-react'
import { Button } from '../components/role-app/Button'
import { LayoutSearchBar } from '../components/role-app/LayoutSearchBar'
import { LayoutUserBar } from '../components/role-app/LayoutUserBar'
import { RoleAppSidebar, type SidebarNavItem } from '../components/role-app/RoleAppSidebar'
import { isSlaughterhouseRouteEnabled, type SlaughterhouseFeature } from '../config/routeFeatures'
import { useSlaughterhousePendingCounts } from '../hooks/usePendingCounts'
import { NotificationBell } from '../components/role-app/NotificationBell'
import { EmailVerificationBanner } from '../components/role-app/EmailVerificationBanner'
import { useNotificationSummary } from '../hooks/useNotificationSummary'

type NavDef = SidebarNavItem & { feature: SlaughterhouseFeature }

const navigation: NavDef[] = [
  { name: 'Dashboard', href: '/slaughterhouse', icon: LayoutDashboard, end: true, feature: 'dashboard' },
  { name: 'Hayvan Al', href: '/slaughterhouse/buy-animals', icon: ShoppingCart, feature: 'buyAnimals' },
  {
    name: 'Alış Talepleri',
    href: '/slaughterhouse/purchase-requests',
    icon: ClipboardList,
    feature: 'purchaseRequests',
  },
  { name: 'Et Sat', href: '/slaughterhouse/sell-meat', icon: Package, feature: 'sellMeat' },
  { name: 'Teklifler', href: '/slaughterhouse/offers', icon: TrendingUp, feature: 'offers' },
  { name: 'Mesajlar', href: '/slaughterhouse/messages', icon: MessageCircle, feature: 'messages' },
  { name: 'Profil & Ayarlar', href: '/slaughterhouse/settings', icon: Settings, feature: 'settings' },
]

export function SlaughterhouseLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pendingMeatOffers } = useSlaughterhousePendingCounts()
  const { data: notifSummary } = useNotificationSummary()

  const visibleNav = useMemo(
    () =>
      navigation
        .filter((item) => isSlaughterhouseRouteEnabled(item.feature))
        .map(({ feature: _f, ...item }) => ({
          ...item,
          badge:
            item.href === '/slaughterhouse/sell-meat'
              ? pendingMeatOffers
              : item.href === '/slaughterhouse/purchase-requests'
                ? notifSummary?.pendingPurchaseOffers
                : undefined,
        })),
    [pendingMeatOffers, notifSummary?.pendingPurchaseOffers],
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
              { path: '/slaughterhouse/buy-animals', placeholder: 'Satıcı ilanları ara...' },
              { path: '/slaughterhouse/purchase-requests', placeholder: 'Alış taleplerimde ara...' },
              { path: '/slaughterhouse/sell-meat', placeholder: 'Et ilanlarımda ara...' },
            ]}
            fallback={{ path: '/slaughterhouse/buy-animals', placeholder: 'Satıcı ilanları ara...' }}
          />

          <div className="flex items-center gap-2 flex-shrink-0">
            <NotificationBell />
            <LayoutUserBar role="SLAUGHTERHOUSE" settingsPath="/slaughterhouse/settings" />
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
