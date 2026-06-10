import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Beef, Factory } from 'lucide-react'
import { Card } from '../components/role-app/Card'
import { Button } from '../components/role-app/Button'
import { PageLoader } from '../components/role-app/PageLoader'
import { useMe } from '../hooks/useMe'
import {
  defaultBuyerPath,
  defaultSellerPath,
  defaultSlaughterhousePath,
  routeFeatures,
} from '../config/routeFeatures'
import { isAdmin, isBuyer, isSeller, isSlaughterhouse } from '../types/me'
import { getRoleHomePath } from '../lib/roleHomePath'
import { brandLogoUrl } from '../lib/brandAssets'

type PortalOption = {
  id: 'buyer' | 'seller' | 'slaughterhouse'
  title: string
  description: string
  icon: typeof User
  path: string
  enabled: boolean
  roles: string[]
}

function hasAnyEnabled(features: Record<string, boolean>): boolean {
  return Object.values(features).some(Boolean)
}

export default function RoleSelectorPage() {
  const navigate = useNavigate()
  const { user, loading } = useMe()

  const portals: PortalOption[] = useMemo(
    () => [
    {
      id: 'buyer',
      title: 'Et Alıcısı',
      description: 'Kasap, restoran veya market. Kesimhanelerden et satın alırsınız.',
      icon: User,
      path: defaultBuyerPath(),
      enabled: hasAnyEnabled(routeFeatures.buyer),
      roles: ['MEAT_BUYER', 'ADMIN'],
    },
    {
      id: 'seller',
      title: 'Hayvan Satıcısı',
      description: 'Çiftçi veya besici. Kesimhanelere canlı hayvan satarsınız.',
      icon: Beef,
      path: defaultSellerPath(),
      enabled: hasAnyEnabled(routeFeatures.seller),
      roles: ['ANIMAL_SELLER', 'ADMIN'],
    },
    {
      id: 'slaughterhouse',
      title: 'Kesimhane',
      description: 'Çiftçilerden hayvan alıp işleyerek et alıcılarına satarsınız.',
      icon: Factory,
      path: defaultSlaughterhousePath(),
      enabled: hasAnyEnabled(routeFeatures.slaughterhouse),
      roles: ['SLAUGHTERHOUSE', 'ADMIN'],
    },
    ],
    [],
  )

  const visiblePortals = useMemo(
    () =>
      portals.filter((p) => {
        if (!p.enabled) return false
        if (!user) return true
        if (isAdmin(user.role)) return true
        if (p.id === 'buyer' && isBuyer(user.role)) return true
        if (p.id === 'seller' && isSeller(user.role)) return true
        if (p.id === 'slaughterhouse' && isSlaughterhouse(user.role)) return true
        return false
      }),
    [portals, user],
  )

  useEffect(() => {
    if (loading || !user) return
    const home = getRoleHomePath(user.role)
    if (home !== '/role-selector') {
      navigate(home, { replace: true })
      return
    }
    if (visiblePortals.length === 1) {
      navigate(visiblePortals[0].path, { replace: true })
    }
  }, [loading, user, visiblePortals, navigate])

  if (loading) {
    return <PageLoader />
  }

  return (
    <div className="role-app min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <img
              src={brandLogoUrl('svg')}
              alt="derdimET"
              className="h-12 w-auto max-w-[min(100%,18rem)] object-contain"
            />
          </div>
          <p className="text-muted-foreground">
            Çiftlikten sofraya dürüst bir pazar yeri
          </p>
          {user && (
            <p className="text-small text-muted-foreground mt-2">
              Hoş geldiniz, {user.name}
            </p>
          )}
        </div>

        {visiblePortals.length === 0 ? (
          <Card variant="alt" elevation="soft" className="text-center py-10">
            <p className="text-muted-foreground">
              Hesabınız için henüz aktif panel yok. Eski panele{' '}
              <button
                type="button"
                className="text-primary font-medium underline"
                onClick={() => navigate('/dashboard')}
              >
                buradan
              </button>{' '}
              ulaşabilirsiniz.
            </p>
          </Card>
        ) : (
          <div
            className={`grid grid-cols-1 gap-6 ${
              visiblePortals.length === 3
                ? 'md:grid-cols-3'
                : visiblePortals.length === 2
                  ? 'md:grid-cols-2'
                  : 'max-w-md mx-auto'
            }`}
          >
            {visiblePortals.map((portal) => {
              const Icon = portal.icon
              return (
                <Card
                  key={portal.id}
                  elevation="hover"
                  className="cursor-pointer group"
                  onClick={() => navigate(portal.path)}
                >
                  <div className="flex flex-col items-center text-center p-8">
                    <div
                      className={`size-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${
                        portal.id === 'seller' ? 'bg-secondary/10' : 'bg-primary-soft'
                      }`}
                    >
                      <Icon
                        className={`size-8 ${
                          portal.id === 'seller' ? 'text-secondary' : 'text-primary'
                        }`}
                      />
                    </div>
                    <h3 className="mb-2">{portal.title}</h3>
                    <p className="text-small text-muted-foreground mb-6">{portal.description}</p>
                    <Button variant="primary" className="w-full">
                      {portal.title} Olarak Gir
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {user && isAdmin(user.role) && (
          <Card variant="alt" elevation="none" className="mt-8 text-center">
            <div className="py-4">
              <Button variant="secondary" onClick={() => navigate('/dashboard')}>
                Yönetici / eski panel
              </Button>
            </div>
          </Card>
        )}

        <Card variant="alt" elevation="none" className="mt-8 text-center">
          <div className="py-6">
            <p className="text-small text-muted-foreground">
              Menüde görünmeyen sayfalar backend API’si hazır olana kadar kapalıdır.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
