import { useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  ClipboardList,
  Package,
  TrendingUp,
  Heart,
  MessageCircle,
  Settings,
} from 'lucide-react'
import { LayoutSearchBar } from '../components/role-app/LayoutSearchBar'
import { LayoutUserBar } from '../components/role-app/LayoutUserBar'
import { RoleAppShell } from '../components/role-app/RoleAppShell'
import type { SidebarNavItem } from '../components/role-app/RoleAppSidebar'
import { isSlaughterhouseRouteEnabled, type SlaughterhouseFeature } from '../config/routeFeatures'
import { useSlaughterhousePendingCounts } from '../hooks/usePendingCounts'
import { useMessageUnreadCount } from '../hooks/useMessageUnreadCount'
import { NotificationBell } from '../components/role-app/NotificationBell'
import { useNotificationSummary } from '../hooks/useNotificationSummary'
import { NAV_ACTIVE_PRIMARY } from '../lib/roleAppNav'

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
  { name: 'Favoriler', href: '/slaughterhouse/favorites', icon: Heart, feature: 'favorites' },
  { name: 'Teklifler', href: '/slaughterhouse/offers', icon: TrendingUp, feature: 'offers' },
  { name: 'Mesajlar', href: '/slaughterhouse/messages', icon: MessageCircle, feature: 'messages' },
  { name: 'Profil & Ayarlar', href: '/slaughterhouse/settings', icon: Settings, feature: 'settings' },
]

const SIDEBAR_ACTIVE = NAV_ACTIVE_PRIMARY

export function SlaughterhouseLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pendingMeatOffers } = useSlaughterhousePendingCounts()
  const { data: notifSummary } = useNotificationSummary()
  const unreadMessages = useMessageUnreadCount()

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
                : item.href === '/slaughterhouse/messages'
                  ? unreadMessages
                  : undefined,
        })),
    [pendingMeatOffers, notifSummary?.pendingPurchaseOffers, unreadMessages],
  )

  return (
    <RoleAppShell
      mobileOpen={mobileOpen}
      onMobileOpenChange={setMobileOpen}
      sidebarItems={visibleNav}
      activeClassName={SIDEBAR_ACTIVE}
      searchBar={
        <LayoutSearchBar
          targets={[
            { path: '/slaughterhouse/buy-animals', placeholder: 'Satıcı ilanları ara...' },
            { path: '/slaughterhouse/purchase-requests', placeholder: 'Alış taleplerimde ara...' },
            { path: '/slaughterhouse/sell-meat', placeholder: 'Et ilanlarımda ara...' },
            { path: '/slaughterhouse/favorites', placeholder: 'Favorilerde ara...' },
          ]}
          fallback={{ path: '/slaughterhouse/buy-animals', placeholder: 'Satıcı ilanları ara...' }}
        />
      }
      userBar={
        <>
          <NotificationBell />
          <LayoutUserBar role="SLAUGHTERHOUSE" settingsPath="/slaughterhouse/settings" />
        </>
      }
    >
      <Outlet />
    </RoleAppShell>
  )
}
