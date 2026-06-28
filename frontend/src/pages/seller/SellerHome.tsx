import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Package, TrendingUp, Beef, Plus, CircleCheck } from 'lucide-react'
import { Button } from '../../components/role-app/Button'
import { Card, CardContent } from '../../components/role-app/Card'
import { Chip } from '../../components/role-app/Chip'
import { StatCard } from '../../components/role-app/StatCard'
import { ListingCard } from '../../components/role-app/ListingCard'
import { PurchaseRequestCard } from '../../components/role-app/PurchaseRequestCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { PageState } from '../../components/role-app/PageState'
import { CreateAnimalListingModal } from '../../components/role-app/CreateAnimalListingModal'
import { useMe } from '../../hooks/useMe'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { useApi } from '../../hooks/useApi'
import { useSyncedSearchQuery } from '../../hooks/useSyncedSearchQuery'
import * as sellerApi from '../../api/seller'
import { purchaseRequestCardProps, sellerListingToListingCard } from '../../api/mappers'
import type { AnimalCategory } from '../../api/types'
import { SellerSalesCard } from '../../components/role-app/SellerSalesCard'
import { offerStatusLabel } from '../../api/format'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { Input } from '../../components/role-app/Input'
import { PageHero } from '../../components/role-app/PageHero'

const categories = [
  { label: 'Tümü', value: null as AnimalCategory | null },
  { label: 'Küçükbaş', value: 'KUCUKBAS' as AnimalCategory },
  { label: 'Büyükbaş', value: 'BUYUKBAS' as AnimalCategory },
]

const requestSortOptions = [
  { label: 'En yeni', value: 'newest' as const },
  { label: 'Adet ↑', value: 'quantityAsc' as const },
  { label: 'Adet ↓', value: 'quantityDesc' as const },
  { label: 'Ağırlık ↑', value: 'weightAsc' as const },
  { label: 'Ağırlık ↓', value: 'weightDesc' as const },
]

export function SellerHome() {
  const { user } = useMe()
  const navigate = useNavigate()
  const { blocked: favoriteBlocked } = useEmailVerificationGate()
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery()
  const [selectedCategory, setSelectedCategory] = useState<AnimalCategory | null>(null)
  const [requestSort, setRequestSort] = useState<'newest' | 'quantityAsc' | 'quantityDesc' | 'weightAsc' | 'weightDesc'>('newest')
  const [quantityMin, setQuantityMin] = useState('')
  const [quantityMax, setQuantityMax] = useState('')
  const [weightMin, setWeightMin] = useState('')
  const [weightMax, setWeightMax] = useState('')
  const [showCreate, setShowCreate] = useState(false)

  const listingsQuery = useApi(() => sellerApi.listMyAnimalListings(), [])
  const requestsQuery = useApi(
    () =>
      sellerApi.listAnimalPurchaseRequests({
        q: searchQuery,
        category: selectedCategory ?? undefined,
        quantityMin: quantityMin ? Number(quantityMin) : undefined,
        quantityMax: quantityMax ? Number(quantityMax) : undefined,
        expectedWeightMin: weightMin ? Number(weightMin) : undefined,
        expectedWeightMax: weightMax ? Number(weightMax) : undefined,
        sort: requestSort,
      }),
    [searchQuery, selectedCategory, requestSort, quantityMin, quantityMax, weightMin, weightMax],
  )
  const incomingQuery = useApi(() => sellerApi.listIncomingListingOffers(), [])
  const outgoingQuery = useApi(() => sellerApi.listMyAnimalOffers(), [])
  const salesQuery = useApi(() => sellerApi.listSales(50), [])

  const myListings = listingsQuery.data ?? []
  const openListings = myListings.filter((l) => l.status === 'OPEN')
  const incoming = incomingQuery.data ?? []
  const pendingIncoming = incoming.filter((o) => o.status === 'PENDING').length
  const pendingOutgoing = (outgoingQuery.data ?? []).filter((o) => o.status === 'PENDING').length
  const completedSales = salesQuery.data?.length ?? 0

  const filteredRequests = useMemo(
    () => (requestsQuery.data ?? []).filter((r) => r.status === 'OPEN'),
    [requestsQuery.data],
  )

  const myCards = openListings.map(sellerListingToListingCard)

  function reloadAll() {
    listingsQuery.reload()
    requestsQuery.reload()
    incomingQuery.reload()
    outgoingQuery.reload()
  }

  return (
    <RoleAppPage>
      <PageHero
        eyebrow="Satıcı paneli"
        title={`Hoş geldiniz${user?.name ? `, ${user.name.split(' ')[0]}` : ''}`}
        description={
          <>
            <p>Kesimhane talepleri ve ilanlarınız</p>
            {searchQuery.trim() ? (
              <p className="text-small mt-2">
                &ldquo;{searchQuery.trim()}&rdquo; için {filteredRequests.length} açık talep
              </p>
            ) : null}
          </>
        }
        actions={
          <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="size-4" />
            Yeni ilan
          </Button>
        }
      />

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Aktif ilanlarım"
          value={String(openListings.length)}
          icon={Package}
          accent="primary"
        />
        <StatCard
          title="Gelen teklifler"
          value={String(incoming.length)}
          icon={TrendingUp}
          accent="secondary"
          trend={
            pendingIncoming > 0
              ? { value: `${pendingIncoming} beklemede`, positive: true }
              : undefined
          }
        />
        <StatCard
          title="Verdiğim teklifler"
          value={String(outgoingQuery.data?.length ?? 0)}
          icon={Beef}
          accent="accent"
          trend={
            pendingOutgoing > 0
              ? { value: `${pendingOutgoing} beklemede`, positive: true }
              : undefined
          }
        />
        <StatCard
          title="Tamamlanan satışlar"
          value={salesQuery.loading ? '—' : String(completedSales)}
          icon={CircleCheck}
          accent="success"
        />
      </div>

      <Tabs defaultValue="requests">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <TabsList>
            <TabsTrigger value="requests">Kesimhane alış talepleri</TabsTrigger>
            <TabsTrigger value="mylistings">İlanlarım ({openListings.length})</TabsTrigger>
            <TabsTrigger value="offers">Gelen teklifler ({incoming.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="requests">
          <Card className="mb-6" elevation="soft">
            <CardContent className="py-5 space-y-4">
              <div>
                <p className="text-small font-medium mb-3">Hayvan kategorisi</p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Chip
                      key={category.label}
                      selected={selectedCategory === category.value}
                      onClick={() => setSelectedCategory(category.value)}
                    >
                      {category.label}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-small font-medium mb-3">Sıralama</p>
                <div className="flex flex-wrap gap-2">
                  {requestSortOptions.map((o) => (
                    <Chip key={o.value} selected={requestSort === o.value} onClick={() => setRequestSort(o.value)}>
                      {o.label}
                    </Chip>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Input label="Adet min" type="number" value={quantityMin} onChange={(e) => setQuantityMin(e.target.value)} />
                <Input label="Adet max" type="number" value={quantityMax} onChange={(e) => setQuantityMax(e.target.value)} />
                <Input label="Ağırlık min (kg)" type="number" value={weightMin} onChange={(e) => setWeightMin(e.target.value)} />
                <Input label="Ağırlık max (kg)" type="number" value={weightMax} onChange={(e) => setWeightMax(e.target.value)} />
              </div>
            </CardContent>
          </Card>
          <PageState
            loading={requestsQuery.loading}
            error={requestsQuery.error}
            onRetry={requestsQuery.reload}
            empty={filteredRequests.length === 0}
            emptyMessage={
              searchQuery.trim()
                ? 'Aramanıza uygun açık alış talebi bulunamadı.'
                : 'Açık kesimhane alış talebi yok.'
            }
            emptyAction={
              searchQuery.trim() ? (
                <Button variant="secondary" type="button" onClick={() => setSearchQuery('')}>
                  Aramayı temizle
                </Button>
              ) : (
                <Button variant="secondary" type="button" onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory(null)
                  setQuantityMin('')
                  setQuantityMax('')
                  setWeightMin('')
                  setWeightMax('')
                }}>
                  Filtreleri sıfırla
                </Button>
              )
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRequests.map((req) => (
                <PurchaseRequestCard
                  key={req.id}
                  {...purchaseRequestCardProps(req)}
                  favoriteAddBlocked={favoriteBlocked}
                  onClick={() => navigate(`/seller/requests/${req.id}`)}
                  onOffer={() => navigate(`/seller/requests/${req.id}`)}
                />
              ))}
            </div>
          </PageState>
        </TabsContent>

        <TabsContent value="mylistings">
          <PageState
            loading={listingsQuery.loading}
            error={listingsQuery.error}
            onRetry={listingsQuery.reload}
            empty={myCards.length === 0}
            emptyMessage="Henüz hayvan ilanınız yok."
            emptyAction={
              <Button variant="primary" type="button" onClick={() => setShowCreate(true)}>
                İlk ilanınızı oluşturun
              </Button>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCards.map((listing) => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          </PageState>
        </TabsContent>

        <TabsContent value="offers">
          <PageState
            loading={incomingQuery.loading}
            error={incomingQuery.error}
            onRetry={incomingQuery.reload}
            empty={incoming.length === 0}
            emptyMessage="İlanlarınıza henüz teklif gelmedi."
            emptyAction={
              <Link to="/seller/listings">
                <Button variant="primary" type="button">
                  İlanlarımı yönet
                </Button>
              </Link>
            }
          >
            <div className="space-y-3">
              {incoming.slice(0, 5).map((o) => (
                <Card key={o.offerId}>
                  <CardContent className="p-4 flex justify-between items-center gap-4">
                    <div>
                      <p className="font-medium">{o.slaughterhouseName || 'Kesimhane'}</p>
                      <p className="text-small text-muted-foreground">
                        {o.listingType} · {offerStatusLabel(o.status)}
                      </p>
                    </div>
                    <Link to="/seller/offers">
                      <Button variant="ghost" size="sm">
                        Tümünü gör
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageState>
          {incoming.length > 0 && (
            <div className="mt-4 text-center">
              <Link to="/seller/offers">
                <Button variant="secondary">Teklifler sayfası</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateAnimalListingModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={reloadAll}
      />
      <SellerSalesCard limit={4} compact />
    </RoleAppPage>
  )
}
