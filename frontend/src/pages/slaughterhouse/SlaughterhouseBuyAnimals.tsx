import { useState } from 'react'
import { ListingCard } from '../../components/role-app/ListingCard'
import { Button } from '../../components/role-app/Button'
import { PageState } from '../../components/role-app/PageState'
import { CreateSlaughterhouseAnimalOfferModal } from '../../components/role-app/CreateSlaughterhouseAnimalOfferModal'
import { AnimalListingDetailModal } from '../../components/role-app/AnimalListingDetailModal'
import { useApi } from '../../hooks/useApi'
import { useToggleFavorite } from '../../hooks/useToggleFavorite'
import { useSyncedSearchQuery } from '../../hooks/useSyncedSearchQuery'
import * as shApi from '../../api/slaughterhouse'
import { sellerListingToListingCard } from '../../api/mappers'
import type { SellerAnimalListingDto } from '../../api/types'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'

export function SlaughterhouseBuyAnimals() {
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery()
  const [detailId, setDetailId] = useState<number | null>(null)
  const [offerTarget, setOfferTarget] = useState<SellerAnimalListingDto | null>(null)
  const { data, loading, error, reload } = useApi(
    () => shApi.listAnimalListings({ q: searchQuery }),
    [searchQuery],
  )
  const { toggle: toggleFavorite, error: favoriteError, blocked: favoriteBlocked } = useToggleFavorite()

  const items = data ?? []

  return (
    <RoleAppPage>
      <div className="mb-8">
        <h1 className="mb-2">Hayvan al</h1>
        <p className="text-muted-foreground">Satıcıların açık hayvan ilanları</p>
        {favoriteError ? (
          <p className="mt-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {favoriteError}
          </p>
        ) : null}
        {searchQuery.trim() ? (
          <p className="text-small text-muted-foreground mt-2">{items.length} ilan bulundu</p>
        ) : null}
      </div>

      <PageState
        loading={loading}
        error={error}
        onRetry={reload}
        empty={items.length === 0}
        emptyMessage={
          searchQuery.trim()
            ? 'Aramanıza uygun hayvan ilanı bulunamadı.'
            : 'Açık hayvan ilanı bulunamadı.'
        }
        emptyAction={
          searchQuery.trim() ? (
            <Button variant="secondary" type="button" onClick={() => setSearchQuery('')}>
              Aramayı temizle
            </Button>
          ) : undefined
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const card = sellerListingToListingCard(item)
            return (
              <div key={item.id} className="space-y-2">
                <ListingCard
                  {...card}
                  isFavorite={!!item.isFavoritedByMe}
                  favoriteUserId={item.sellerId}
                  favoriteAddBlocked={favoriteBlocked}
                  onFavoriteToggle={(id, next) => {
                    void toggleFavorite(id, !next).then(() => reload())
                  }}
                  onClick={() => setDetailId(item.id)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={!!item.hasOfferFromMe}
                  title={item.hasOfferFromMe ? 'Bu ilan için zaten teklif verdiniz' : undefined}
                  onClick={() => setDetailId(item.id)}
                >
                  {item.hasOfferFromMe ? 'Teklif verildi' : 'Teklif ver'}
                </Button>
              </div>
            )
          })}
        </div>
      </PageState>

      <AnimalListingDetailModal
        listingId={detailId}
        open={detailId != null}
        onClose={() => setDetailId(null)}
        onOffer={(item) => {
          setDetailId(null)
          setOfferTarget(item)
        }}
      />

      <CreateSlaughterhouseAnimalOfferModal
        open={offerTarget != null}
        listingId={offerTarget?.id ?? null}
        listingTitle={
          offerTarget
            ? [offerTarget.type, offerTarget.breed].filter(Boolean).join(' · ') || 'Hayvan ilanı'
            : ''
        }
        onClose={() => setOfferTarget(null)}
        onCreated={reload}
      />
    </RoleAppPage>
  )
}
