import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/role-app/Card'
import { Button } from '../../components/role-app/Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { ListingCard } from '../../components/role-app/ListingCard'
import { PageState } from '../../components/role-app/PageState'
import { Heart, Building2, MapPin, X } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { useToggleFavorite } from '../../hooks/useToggleFavorite'
import * as buyerApi from '../../api/buyer'
import { meatSaleToListingCard } from '../../api/mappers'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'

export function BuyerFavorites() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('listings')
  const { toggle: toggleFavorite, error: favoriteError, blocked: favoriteBlocked } = useToggleFavorite()

  const listingsQuery = useApi(() => buyerApi.listFavoriteMeatSaleRequests(), [])
  const favShQuery = useApi(() => buyerApi.listFavoriteSlaughterhouses(), [])

  const favoriteItems = listingsQuery.data ?? []

  const slaughterhouses = favShQuery.data ?? []

  return (
    <RoleAppPage>
      <div className="mb-8">
        <h1 className="mb-2">Favorilerim</h1>
        <p className="text-muted-foreground">Favori et ilanları ve kesimhaneler</p>
        {favoriteError ? (
          <p className="mt-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {favoriteError}
          </p>
        ) : null}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="listings">
            <Heart className="size-4 mr-2" />
            Favori İlanlar ({favoriteItems.length})
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
            emptyMessage="Henüz favori ilanınız yok. Arama ekranından ilanları favorileyebilirsiniz."
            emptyAction={
              <Link to="/buyer/search">
                <Button variant="primary" type="button">
                  İlanları keşfet
                </Button>
              </Link>
            }
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
                    favoriteUserId={item.id}
                    favoriteAddBlocked={favoriteBlocked}
                    onFavoriteToggle={(id) => {
                      void buyerApi.toggleMeatListingFavorite(id).then(() => listingsQuery.reload())
                    }}
                    onClick={() => navigate(`/buyer/listings/${item.id}`)}
                  />
                )
              })}
            </div>
          </PageState>
        </TabsContent>

        <TabsContent value="slaughterhouses">
          <PageState
            loading={favShQuery.loading}
            error={favShQuery.error}
            onRetry={favShQuery.reload}
            empty={slaughterhouses.length === 0}
            emptyMessage="Henüz favori kesimhane eklemediniz."
            emptyAction={
              <Link to="/buyer/search">
                <Button variant="primary" type="button">
                  İlanları keşfet
                </Button>
              </Link>
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {slaughterhouses.map((sh) => (
                <Card key={sh.slaughterhouseId}>
                  <CardContent className="p-5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
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
                    </div>
                    {sh.slaughterhouseId != null ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        aria-label="Favoriden çıkar"
                        onClick={() => {
                          void toggleFavorite(sh.slaughterhouseId!, true).then(() => {
                            favShQuery.reload()
                            listingsQuery.reload()
                          })
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
