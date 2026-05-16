import { useMemo, useState } from 'react'
import { TrendingUp, Package, Building2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../../components/role-app/Card'
import { Chip } from '../../components/role-app/Chip'
import { StatCard } from '../../components/role-app/StatCard'
import { ListingCard } from '../../components/role-app/ListingCard'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { Button } from '../../components/role-app/Button'
import { PageState } from '../../components/role-app/PageState'
import { useMe } from '../../hooks/useMe'
import { useApi } from '../../hooks/useApi'
import * as buyerApi from '../../api/buyer'
import { meatSaleToListingCard } from '../../api/mappers'
import { filterMeatListings } from '../../lib/meatListingFilters'
import { formatRelativeTr } from '../../api/format'
import { CreateMeatOfferModal } from '../../components/role-app/CreateMeatOfferModal'
import { MeatListingDetailModal } from '../../components/role-app/MeatListingDetailModal'
import { BuyerPurchasesCard } from '../../components/role-app/BuyerPurchasesCard'
import { useToggleFavorite } from '../../hooks/useToggleFavorite'
import type { MeatSaleRequestDto } from '../../api/types'

const meatTypes = ['Tümü', 'Dana', 'Kuzu', 'Kıyma', 'Biftek', 'Pirzola', 'But', 'Antrikot']
const animalCategories = ['Tüm Kategoriler', 'Küçükbaş', 'Büyükbaş']

export function BuyerHome() {
  const { user } = useMe()
  const [selectedMeatType, setSelectedMeatType] = useState('Tümü')
  const [selectedAnimalCategory, setSelectedAnimalCategory] = useState('Tüm Kategoriler')
  const [detailId, setDetailId] = useState<number | null>(null)
  const [offerTarget, setOfferTarget] = useState<MeatSaleRequestDto | null>(null)
  const { toggle: toggleFavorite, error: favoriteError, blocked: favoriteBlocked } = useToggleFavorite()

  const listingsQuery = useApi(() => buyerApi.listMeatSaleRequests(), [])
  const offersQuery = useApi(() => buyerApi.listMyMeatOffers(), [])
  const purchasesQuery = useApi(() => buyerApi.listPurchases(50), [])
  const favQuery = useApi(() => buyerApi.listFavoriteSlaughterhouses(), [])

  const pendingOffers = (offersQuery.data ?? []).filter((o) => o.status === 'PENDING').length
  const favCount = favQuery.data?.length ?? 0
  const cities = useMemo(() => {
    const set = new Set<string>()
    for (const item of listingsQuery.data ?? []) {
      if (item.slaughterhouseCity) set.add(item.slaughterhouseCity)
    }
    return ['Tüm Şehirler', ...Array.from(set).sort()]
  }, [listingsQuery.data])
  const [selectedCity, setSelectedCity] = useState('Tüm Şehirler')

  const filteredWithCity = useMemo(
    () =>
      filterMeatListings(listingsQuery.data ?? [], {
        meatType: selectedMeatType,
        animalCategory: selectedAnimalCategory,
        city: selectedCity,
      }),
    [listingsQuery.data, selectedMeatType, selectedAnimalCategory, selectedCity],
  )
  async function handleFavorite(userId: number, isFavorited: boolean) {
    await toggleFavorite(userId, isFavorited)
    listingsQuery.reload()
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Hoş geldiniz{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
        <p className="text-muted-foreground">Kesimhanelerden taze et satış ilanları</p>
      </div>
      {favoriteError ? (
        <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {favoriteError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Verilen Teklifler"
          value={String(offersQuery.data?.length ?? '—')}
          icon={TrendingUp}
          trend={
            pendingOffers > 0
              ? { value: `${pendingOffers} beklemede`, positive: true }
              : undefined
          }
        />
        <StatCard
          title="Tamamlanan siparişler"
          value={purchasesQuery.loading ? '—' : String(purchasesQuery.data?.length ?? 0)}
          icon={ShoppingBag}
        />
        <StatCard title="Favori Kesimhaneler" value={String(favCount)} icon={Building2} />
        <StatCard
          title="Açık İlanlar"
          value={String(listingsQuery.data?.length ?? '—')}
          icon={Package}
        />
      </div>

      <Tabs defaultValue="listings">
        <TabsList className="mb-6">
          <TabsTrigger value="listings">Taze Et İlanları</TabsTrigger>
          <TabsTrigger value="recommended">Favori Kesimhaneler</TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <Card className="mb-6" elevation="soft">
            <CardContent className="py-5">
              <div className="space-y-4">
                <div>
                  <p className="text-small font-medium mb-3">Et Türü</p>
                  <div className="flex flex-wrap gap-2">
                    {meatTypes.map((type) => (
                      <Chip
                        key={type}
                        selected={selectedMeatType === type}
                        onClick={() => setSelectedMeatType(type)}
                      >
                        {type}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-small font-medium mb-3">Hayvan Kategorisi</p>
                  <div className="flex flex-wrap gap-2">
                    {animalCategories.map((category) => (
                      <Chip
                        key={category}
                        selected={selectedAnimalCategory === category}
                        onClick={() => setSelectedAnimalCategory(category)}
                      >
                        {category}
                      </Chip>
                    ))}
                  </div>
                </div>
                {cities.length > 1 && (
                  <div>
                    <p className="text-small font-medium mb-3">Şehir</p>
                    <div className="flex flex-wrap gap-2">
                      {cities.map((city) => (
                        <Chip
                          key={city}
                          selected={selectedCity === city}
                          onClick={() => setSelectedCity(city)}
                        >
                          {city}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <PageState
            loading={listingsQuery.loading}
            error={listingsQuery.error}
            onRetry={listingsQuery.reload}
            empty={filteredWithCity.length === 0}
            emptyMessage="Filtrelere uygun ilan bulunamadı."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWithCity.map((item) => {
                const listing = meatSaleToListingCard(item)
                return (
                  <ListingCard
                    key={listing.id}
                    {...listing}
                    showSlaughterhouseLabel
                    isFavorite={!!item.isFavoritedByMe}
                    favoriteUserId={item.slaughterhouseId}
                    favoriteAddBlocked={favoriteBlocked}
                    onFavoriteToggle={(id, next) => void handleFavorite(id, !next)}
                    onClick={() => setDetailId(item.id)}
                  />
                )
              })}
            </div>
          </PageState>
        </TabsContent>

        <TabsContent value="recommended">
          <PageState
            loading={favQuery.loading}
            error={favQuery.error}
            onRetry={favQuery.reload}
            empty={(favQuery.data?.length ?? 0) === 0}
            emptyMessage="Henüz favori kesimhane eklemediniz."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(favQuery.data ?? []).map((sh) => (
                <Card key={sh.slaughterhouseId}>
                  <CardContent className="p-5">
                    <h3 className="font-medium">
                      {sh.slaughterhouseCompanyName || sh.slaughterhouseName || 'Kesimhane'}
                    </h3>
                    <p className="text-small text-muted-foreground mt-1">
                      {[sh.slaughterhouseCity].filter(Boolean).join(', ') || 'Konum belirtilmedi'}
                    </p>
                    {sh.createdAt ? (
                      <p className="text-caption text-muted-foreground mt-2">
                        {formatRelativeTr(sh.createdAt)} eklendi
                      </p>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageState>
          {(favQuery.data?.length ?? 0) === 0 && !favQuery.loading ? (
            <div className="mt-4 text-center">
              <Link to="/buyer/search">
                <Button variant="secondary">Kesimhane ve ilan ara</Button>
              </Link>
            </div>
          ) : null}
        </TabsContent>
      </Tabs>

      <MeatListingDetailModal
        listingId={detailId}
        open={detailId != null}
        onClose={() => setDetailId(null)}
        onOffer={(item) => {
          setDetailId(null)
          setOfferTarget(item)
        }}
      />

      <CreateMeatOfferModal
        open={offerTarget != null}
        saleRequestId={offerTarget?.id ?? null}
        listingTitle={offerTarget?.title ?? ''}
        onClose={() => setOfferTarget(null)}
        onCreated={() => {
          offersQuery.reload()
          listingsQuery.reload()
        }}
      />

      <BuyerPurchasesCard limit={4} compact />
    </div>
  )
}
