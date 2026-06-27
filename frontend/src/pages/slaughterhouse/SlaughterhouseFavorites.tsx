import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Beef, Heart, ShoppingBag, User, X } from 'lucide-react'
import { Card, CardContent } from '../../components/role-app/Card'
import { Button } from '../../components/role-app/Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { ListingCard } from '../../components/role-app/ListingCard'
import { PageState } from '../../components/role-app/PageState'
import { useApi } from '../../hooks/useApi'
import { useToggleFavorite } from '../../hooks/useToggleFavorite'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import * as shApi from '../../api/slaughterhouse'
import { sellerListingToListingCard } from '../../api/mappers'
import { formatDateTr } from '../../api/format'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

export function SlaughterhouseFavorites() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('animals')
  const [listingError, setListingError] = useState<string | null>(null)
  const { toggle: toggleFavorite, error: buyerFavoriteError } = useToggleFavorite()
  const { blocked: favoriteBlocked } = useEmailVerificationGate()

  const animalListingsQuery = useApi(() => shApi.listFavoriteAnimalListings(), [])
  const buyersQuery = useApi(() => shApi.listFavoriteBuyers(), [])

  const animalItems = animalListingsQuery.data ?? []
  const buyers = buyersQuery.data ?? []

  async function handleUnfavoriteListing(listingId: number) {
    setListingError(null)
    try {
      await shApi.toggleAnimalListingFavorite(listingId)
      animalListingsQuery.reload()
    } catch (e) {
      setListingError(e instanceof Error ? e.message : 'Favori güncellenemedi')
    }
  }

  return (
    <RoleAppPage>
      <PageHeader title="Favorilerim" description="Beğendiğiniz hayvan ilanları" />
      {listingError || buyerFavoriteError ? (
        <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {listingError || buyerFavoriteError}
        </p>
      ) : null}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="animals">
            <Beef className="size-4 mr-2" />
            Hayvan Al ({animalItems.length})
          </TabsTrigger>
          <TabsTrigger value="buyers">
            <ShoppingBag className="size-4 mr-2" />
            Et Sat ({buyers.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="animals">
          <PageState
            loading={animalListingsQuery.loading}
            error={animalListingsQuery.error}
            onRetry={animalListingsQuery.reload}
            empty={animalItems.length === 0}
            emptyMessage="Henüz favori hayvan ilanınız yok. Hayvan Al sayfasından ilanları favorileyebilirsiniz."
            emptyAction={
              <Link to="/slaughterhouse/buy-animals">
                <Button variant="primary" type="button">
                  Hayvan ilanlarını keşfet
                </Button>
              </Link>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {animalItems.map((item) => {
                const listing = sellerListingToListingCard(item)
                return (
                  <ListingCard
                    key={listing.id}
                    {...listing}
                    isFavorite
                    favoriteUserId={item.id}
                    favoriteAddBlocked={favoriteBlocked}
                    onFavoriteToggle={(id) => void handleUnfavoriteListing(id)}
                    onClick={() => navigate(`/slaughterhouse/listings/${item.id}`)}
                  />
                )
              })}
            </div>
          </PageState>
        </TabsContent>

        <TabsContent value="buyers">
          <PageState
            loading={buyersQuery.loading}
            error={buyersQuery.error}
            onRetry={buyersQuery.reload}
            empty={buyers.length === 0}
            emptyMessage="Henüz favori alıcınız yok. Et satış tekliflerinden alıcıları favorileyebilirsiniz."
            emptyAction={
              <Link to="/slaughterhouse/sell-meat">
                <Button variant="primary" type="button">
                  Et satış paneline git
                </Button>
              </Link>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {buyers.map((buyer) => (
                <Card key={buyer.buyerId ?? buyer.buyerEmail}>
                  <CardContent className="flex items-start justify-between gap-3 p-5">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft">
                        <User className="size-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium">{buyer.buyerName || 'Alıcı'}</h3>
                        {buyer.buyerEmail ? (
                          <p className="text-small text-muted-foreground mt-0.5">{buyer.buyerEmail}</p>
                        ) : null}
                        {buyer.createdAt ? (
                          <p className="text-caption text-muted-foreground mt-2">
                            <Heart className="size-3 inline mr-1" />
                            {formatDateTr(buyer.createdAt)} eklendi
                          </p>
                        ) : null}
                      </div>
                    </div>
                    {buyer.buyerId != null ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        aria-label="Favoriden çıkar"
                        onClick={() => {
                          void toggleFavorite(buyer.buyerId!, true).then(() => buyersQuery.reload())
                        }}
                      >
                        <X className="size-5 text-muted-foreground" />
                      </Button>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </PageState>
        </TabsContent>
      </Tabs>
    </RoleAppPage>
  )
}
