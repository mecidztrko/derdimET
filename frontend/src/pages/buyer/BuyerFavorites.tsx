import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../../components/role-app/Card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { Button } from '../../components/role-app/Button'
import { ListingCard } from '../../components/role-app/ListingCard'
import { PageState } from '../../components/role-app/PageState'
import { Heart, Building2, MapPin } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import * as buyerApi from '../../api/buyer'
import { meatSaleToListingCard } from '../../api/mappers'
import { filterMeatListings } from '../../lib/meatListingFilters'
import { MeatListingDetailModal } from '../../components/role-app/MeatListingDetailModal'
import { CreateMeatOfferModal } from '../../components/role-app/CreateMeatOfferModal'
import type { MeatSaleRequestDto } from '../../api/types'

export function BuyerFavorites() {
  const [activeTab, setActiveTab] = useState('listings')
  const [detailId, setDetailId] = useState<number | null>(null)
  const [offerTarget, setOfferTarget] = useState<MeatSaleRequestDto | null>(null)

  const listingsQuery = useApi(() => buyerApi.listMeatSaleRequests(), [])
  const favShQuery = useApi(() => buyerApi.listFavoriteSlaughterhouses(), [])

  const favoriteItems = useMemo(
    () => filterMeatListings(listingsQuery.data ?? [], { favoritedOnly: true }),
    [listingsQuery.data],
  )

  const slaughterhouses = favShQuery.data ?? []

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Favorilerim</h1>
        <p className="text-muted-foreground">Favori kesimhaneler ve ilgili ilanlar</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="listings">
            <Heart className="size-4 mr-2" />
            Favori Kesimhane İlanları ({favoriteItems.length})
          </TabsTrigger>
          <TabsTrigger value="slaughterhouses">
            <Building2 className="size-4 mr-2" />
            Favori Kesimhaneler ({slaughterhouses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <PageState
            loading={listingsQuery.loading}
            error={listingsQuery.error}
            onRetry={listingsQuery.reload}
            empty={favoriteItems.length === 0}
            emptyMessage="Favori kesimhaneye ait açık ilan bulunamadı. İlan kartından kesimhaneyi favorileyebilirsiniz."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteItems.map((item) => {
                const listing = meatSaleToListingCard(item)
                return (
                  <ListingCard
                    key={listing.id}
                    {...listing}
                    showSlaughterhouseLabel
                    isFavorite
                    onClick={() => setDetailId(item.id)}
                  />
                )
              })}
            </div>
          </PageState>
          {favoriteItems.length === 0 && !listingsQuery.loading ? (
            <div className="mt-6 text-center">
              <Link to="/buyer/search">
                <Button variant="primary">İlanları keşfet</Button>
              </Link>
            </div>
          ) : null}
        </TabsContent>

        <TabsContent value="slaughterhouses">
          <PageState
            loading={favShQuery.loading}
            error={favShQuery.error}
            onRetry={favShQuery.reload}
            empty={slaughterhouses.length === 0}
            emptyMessage="Henüz favori kesimhane eklemediniz."
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slaughterhouses.map((sh) => (
                <Card key={sh.slaughterhouseId}>
                  <CardContent className="p-5">
                    <h3 className="font-medium">
                      {sh.slaughterhouseCompanyName || sh.slaughterhouseName || 'Kesimhane'}
                    </h3>
                    <p className="text-small text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="size-3" />
                      {sh.slaughterhouseCity || 'Konum belirtilmedi'}
                    </p>
                    {sh.slaughterhouseEmail ? (
                      <p className="text-caption text-muted-foreground mt-2">{sh.slaughterhouseEmail}</p>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageState>
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
        onCreated={listingsQuery.reload}
      />
    </div>
  )
}
