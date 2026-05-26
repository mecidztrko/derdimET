import { useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Home, Package, TrendingUp, Eye, MessageCircle, Settings } from 'lucide-react'
import { LayoutSearchBar } from '../components/role-app/LayoutSearchBar'
import { LayoutUserBar } from '../components/role-app/LayoutUserBar'
import { RoleAppShell } from '../components/role-app/RoleAppShell'
import type { SidebarNavItem } from '../components/role-app/RoleAppSidebar'
import { isSellerRouteEnabled, type SellerFeature } from '../config/routeFeatures'
import { useSellerPendingCounts } from '../hooks/usePendingCounts'
import { useMessageUnreadCount } from '../hooks/useMessageUnreadCount'
import { NotificationBell } from '../components/role-app/NotificationBell'

type NavDef = SidebarNavItem & { feature: SellerFeature }

const navigation: NavDef[] = [
  { name: 'Pazar Durumu', href: '/seller', icon: Home, end: true, feature: 'home' },
  { name: 'İlanlarım', href: '/seller/listings', icon: Package, feature: 'listings' },
  { name: 'Teklifler', href: '/seller/offers', icon: TrendingUp, feature: 'offers' },
  { name: 'İncele', href: '/seller/browse', icon: Eye, feature: 'browse' },
  { name: 'Mesajlar', href: '/seller/messages', icon: MessageCircle, feature: 'messages' },
  { name: 'Profil & Ayarlar', href: '/seller/settings', icon: Settings, feature: 'settings' },
]

const SIDEBAR_ACTIVE =
  'bg-secondary/10 text-foreground before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-secondary before:rounded-r'

export function SellerLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pendingIncoming } = useSellerPendingCounts()
  const unreadMessages = useMessageUnreadCount()
  const visibleNav = useMemo(
    () =>
      navigation
        .filter((item) => isSellerRouteEnabled(item.feature))
        .map(({ feature: _f, ...item }) => ({
          ...item,
          badge:
            item.href === '/seller/offers'
              ? pendingIncoming
              : item.href === '/seller/messages'
                ? unreadMessages
                : undefined,
        })),
    [pendingIncoming, unreadMessages],
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
            { path: '/seller/browse', placeholder: 'Pazar ilanları ara...' },
            { path: '/seller/listings', placeholder: 'İlanlarımda ara...' },
            { path: '/seller', placeholder: 'Kesimhane alış talebi ara...', exact: true },
          ]}
          fallback={{ path: '/seller/browse', placeholder: 'Pazar ilanları ara...' }}
        />
      }
      userBar={
        <>
          <NotificationBell />
          <LayoutUserBar role="ANIMAL_SELLER" settingsPath="/seller/settings" />
        </>
      }
    >
      <Outlet />
    </RoleAppShell>
  )
}
