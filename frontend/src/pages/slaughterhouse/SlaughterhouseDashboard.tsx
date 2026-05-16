import { Link } from 'react-router-dom'
import { Package, TrendingUp, ListChecks, ChevronRight } from 'lucide-react'
import { Button } from '../../components/role-app/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../../components/role-app/Card'
import { StatCard } from '../../components/role-app/StatCard'
import { Badge } from '../../components/role-app/Badge'
import { PageState } from '../../components/role-app/PageState'
import { useMe } from '../../hooks/useMe'
import { useApi } from '../../hooks/useApi'
import * as shApi from '../../api/slaughterhouse'
import { animalCategoryLabel, sellerListingToListingCard } from '../../api/mappers'
import { formatDateTr, formatHeadCount, formatKg, formatTry } from '../../api/format'
import { SlaughterhouseRecentTradesCard } from '../../components/role-app/SlaughterhouseRecentTradesCard'
import { MessageUserButton } from '../../components/role-app/MessageUserButton'

export function SlaughterhouseDashboard() {
  const { user } = useMe()
  const animalListings = useApi(() => shApi.listAnimalListings(), [])
  const myOffers = useApi(() => shApi.listAnimalOffers(), [])
  const meatListings = useApi(() => shApi.listMyMeatSaleRequests(), [])
  const purchaseReqs = useApi(() => shApi.listMyAnimalPurchaseRequests(), [])
  const incomingMeatOffers = useApi(() => shApi.listIncomingMeatOffers(), [])

  const openMeat = (meatListings.data ?? []).filter((m) => m.status === 'OPEN')
  const pendingBuyOffers = (myOffers.data ?? []).filter((o) => o.status === 'PENDING')
  const pendingMeatOffers = (incomingMeatOffers.data ?? []).filter((o) => o.status === 'PENDING')
  const recentAnimals = (animalListings.data ?? []).slice(0, 4)
  const recentOffers = (myOffers.data ?? []).slice(0, 3)
  const recentMeat = openMeat.slice(0, 3)
  const recentIncomingMeat = pendingMeatOffers.slice(0, 3)

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Kontrol paneli</h1>
        <p className="text-muted-foreground">
          Hoş geldiniz{user?.name ? `, ${user.name.split(' ')[0]}` : ''} — alım ve satış özeti
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Hayvan alım tekliflerim"
          value={String(myOffers.data?.length ?? '—')}
          icon={TrendingUp}
          trend={
            pendingBuyOffers.length > 0
              ? { value: `${pendingBuyOffers.length} beklemede`, positive: true }
              : undefined
          }
        />
        <StatCard
          title="Açık et satış ilanları"
          value={String(openMeat.length)}
          icon={Package}
          trend={
            pendingMeatOffers.length > 0
              ? { value: `${pendingMeatOffers.length} alıcı teklifi`, positive: true }
              : undefined
          }
        />
        <StatCard
          title="Piyasadaki hayvan ilanları"
          value={String(animalListings.data?.length ?? '—')}
          icon={ListChecks}
        />
        <StatCard
          title="Hayvan alış taleplerim"
          value={String(purchaseReqs.data?.length ?? '—')}
          icon={ListChecks}
          trend={
            (purchaseReqs.data ?? []).filter((r) => r.status === 'OPEN').length > 0
              ? {
                  value: `${(purchaseReqs.data ?? []).filter((r) => r.status === 'OPEN').length} açık`,
                  positive: true,
                }
              : undefined
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hayvan satıcı ilanları</CardTitle>
              <Link to="/slaughterhouse/buy-animals">
                <Button variant="ghost" size="sm">
                  Tümü <ChevronRight className="size-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <PageState
              loading={animalListings.loading}
              error={animalListings.error}
              onRetry={animalListings.reload}
              empty={recentAnimals.length === 0}
              emptyMessage="Açık satıcı ilanı yok."
            >
              <div className="space-y-3">
                {recentAnimals.map((item) => {
                  const card = sellerListingToListingCard(item)
                  return (
                    <div key={item.id} className="p-3 rounded-lg bg-card-alt border border-border">
                      <div className="flex justify-between gap-2 mb-1">
                        <p className="font-medium text-small">{card.seller.name}</p>
                        <Badge variant="open">AÇIK</Badge>
                      </div>
                      <p className="text-small">{card.title}</p>
                      <p className="text-caption text-muted-foreground mt-1">
                        {animalCategoryLabel(item.category)} · {card.quantity} · {card.price}/kg
                      </p>
                      <p className="text-caption text-muted-foreground">{card.seller.location}</p>
                    </div>
                  )
                })}
              </div>
            </PageState>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Verdiğim hayvan teklifleri</CardTitle>
              <Link to="/slaughterhouse/offers">
                <Button variant="ghost" size="sm">
                  Tümü <ChevronRight className="size-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <PageState
              loading={myOffers.loading}
              error={myOffers.error}
              onRetry={myOffers.reload}
              empty={recentOffers.length === 0}
              emptyMessage="Henüz teklif vermediniz."
            >
              <div className="space-y-3">
                {recentOffers.map((o) => (
                  <div key={o.offerId} className="p-3 rounded-lg border border-border">
                    <div className="flex justify-between gap-2 mb-1">
                      <p className="font-medium text-small">{o.sellerName || 'Satıcı'}</p>
                      <Badge
                        variant={
                          o.status === 'PENDING'
                            ? 'pending'
                            : o.status === 'ACCEPTED'
                              ? 'accepted'
                              : 'rejected'
                        }
                      >
                        {o.status}
                      </Badge>
                    </div>
                    <p className="text-caption text-muted-foreground">
                      {o.listingType} · {formatTry(o.pricePerKg)} / kg ·{' '}
                      {formatHeadCount(o.quantity)}
                    </p>
                    <p className="text-caption text-muted-foreground mt-1">
                      {formatDateTr(o.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </PageState>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Et satış ilanlarım</CardTitle>
              <Link to="/slaughterhouse/sell-meat">
                <Button variant="ghost" size="sm">
                  Tümü <ChevronRight className="size-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <PageState
              loading={meatListings.loading}
              error={meatListings.error}
              onRetry={meatListings.reload}
              empty={recentMeat.length === 0}
              emptyMessage="Açık et ilanınız yok."
            >
              <div className="space-y-3">
                {recentMeat.map((m) => (
                  <div key={m.id} className="p-3 rounded-lg border border-border">
                    <div className="flex justify-between gap-2">
                      <p className="font-medium text-small">{m.title}</p>
                      <Badge variant="open">AÇIK</Badge>
                    </div>
                    <p className="text-caption text-muted-foreground mt-1">
                      {formatKg(m.quantity)} · {formatTry(m.pricePerKg)} / kg
                    </p>
                  </div>
                ))}
              </div>
            </PageState>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Hayvan alış taleplerim</CardTitle>
              <Link to="/slaughterhouse/purchase-requests">
                <Button variant="ghost" size="sm">
                  Tümü <ChevronRight className="size-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <PageState
              loading={purchaseReqs.loading}
              error={purchaseReqs.error}
              onRetry={purchaseReqs.reload}
              empty={(purchaseReqs.data ?? []).length === 0}
              emptyMessage="Henüz alış talebi yok."
            >
              <div className="space-y-3">
                {(purchaseReqs.data ?? []).slice(0, 3).map((r) => (
                  <div key={r.id} className="p-3 rounded-lg border border-border">
                    <div className="flex justify-between gap-2 mb-1">
                      <p className="font-medium text-small">{r.title}</p>
                      <Badge variant={r.status === 'OPEN' ? 'open' : 'closed'}>
                        {r.status === 'OPEN' ? 'AÇIK' : 'KAPALI'}
                      </Badge>
                    </div>
                    <p className="text-caption text-muted-foreground">
                      {animalCategoryLabel(r.animalCategory)} · {formatHeadCount(r.quantity)} ·{' '}
                      {formatDateTr(r.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </PageState>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Alıcı et teklifleri</CardTitle>
              <Link to="/slaughterhouse/sell-meat">
                <Button variant="ghost" size="sm">
                  Tümü <ChevronRight className="size-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <PageState
              loading={incomingMeatOffers.loading}
              error={incomingMeatOffers.error}
              onRetry={incomingMeatOffers.reload}
              empty={recentIncomingMeat.length === 0}
              emptyMessage="Bekleyen alıcı teklifi yok."
            >
              <div className="space-y-3">
                {recentIncomingMeat.map((o) => (
                  <div key={o.offerId} className="p-3 rounded-lg border border-border">
                    <div className="flex justify-between gap-2 mb-1">
                      <p className="font-medium text-small">{o.buyerName || 'Alıcı'}</p>
                      <Badge variant="pending">BEKLEMEDE</Badge>
                    </div>
                    <p className="text-caption text-muted-foreground">{o.saleRequestTitle}</p>
                    <p className="text-caption text-muted-foreground mt-1">
                      {formatTry(o.pricePerKg)} / kg · {formatKg(o.quantity)}
                    </p>
                    <p className="text-caption text-muted-foreground mt-1">{formatDateTr(o.createdAt)}</p>
                    <div className="mt-3">
                      <MessageUserButton
                        otherUserId={o.buyerId}
                        contextLabel={o.saleRequestTitle ?? 'Et teklifi'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </PageState>
          </CardContent>
        </Card>
      </div>

      <SlaughterhouseRecentTradesCard />
    </div>
  )
}
