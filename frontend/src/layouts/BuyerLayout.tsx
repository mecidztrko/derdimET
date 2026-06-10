import { useState, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { Home, ListFilter, TrendingUp, Heart, MessageCircle, Settings, ShoppingBag } from 'lucide-react'
import { LayoutSearchBar } from '../components/role-app/LayoutSearchBar'
import { LayoutUserBar } from '../components/role-app/LayoutUserBar'
import { RoleAppShell } from '../components/role-app/RoleAppShell'
import type { SidebarNavItem } from '../components/role-app/RoleAppSidebar'
import { isBuyerRouteEnabled, type BuyerFeature } from '../config/routeFeatures'
import { useBuyerPendingCounts } from '../hooks/usePendingCounts'
import { useMessageUnreadCount } from '../hooks/useMessageUnreadCount'
import { NotificationBell } from '../components/role-app/NotificationBell'
import { NAV_ACTIVE_PRIMARY } from '../lib/roleAppNav'

type NavDef = SidebarNavItem & { feature: BuyerFeature }

const navigation: NavDef[] = [
  { name: 'Ana Sayfa', href: '/buyer', icon: Home, end: true, feature: 'home' },
  { name: 'Ara', href: '/buyer/search', icon: ListFilter, feature: 'search' },
  { name: 'Tekliflerim', href: '/buyer/offers', icon: TrendingUp, feature: 'offers' },
  { name: 'Siparişlerim', href: '/buyer/purchases', icon: ShoppingBag, feature: 'purchases' },
  { name: 'Favoriler', href: '/buyer/favorites', icon: Heart, feature: 'favorites' },
  { name: 'Mesajlar', href: '/buyer/messages', icon: MessageCircle, feature: 'messages' },
  { name: 'Ayarlar', href: '/buyer/settings', icon: Settings, feature: 'settings' },
]

const SIDEBAR_ACTIVE = NAV_ACTIVE_PRIMARY

export function BuyerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pendingOffers } = useBuyerPendingCounts()
  const unreadMessages = useMessageUnreadCount()
  const visibleNav = useMemo(
    () =>
      navigation
        .filter((item) => isBuyerRouteEnabled(item.feature))
        .map(({ feature: _f, ...item }) => ({
          ...item,
          badge:
            item.href === '/buyer/offers'
              ? pendingOffers
              : item.href === '/buyer/messages'
                ? unreadMessages
                : undefined,
        })),
    [pendingOffers, unreadMessages],
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
            { path: '/buyer/search', placeholder: 'Et ürünleri ara...' },
            { path: '/buyer/offers', placeholder: 'Tekliflerimde ara...' },
            { path: '/buyer', placeholder: 'Ana sayfada ilan ara...', exact: true },
          ]}
          fallback={{ path: '/buyer/search', placeholder: 'Et ürünleri ara...' }}
        />
      }
      userBar={
        <>
          <NotificationBell />
          <LayoutUserBar role="MEAT_BUYER" settingsPath="/buyer/settings" />
        </>
      }
    >
      <Outlet />
    </RoleAppShell>
  )
}
