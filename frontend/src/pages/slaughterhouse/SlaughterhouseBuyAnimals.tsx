import { useMemo, useState } from 'react'
import { ListingCard } from '../../components/role-app/ListingCard'
import { Button } from '../../components/role-app/Button'
import { PageState } from '../../components/role-app/PageState'
import { CreateSlaughterhouseAnimalOfferModal } from '../../components/role-app/CreateSlaughterhouseAnimalOfferModal'
import { AnimalListingDetailModal } from '../../components/role-app/AnimalListingDetailModal'
import { useApi } from '../../hooks/useApi'
import { useSyncedSearchQuery } from '../../hooks/useSyncedSearchQuery'
import * as shApi from '../../api/slaughterhouse'
import { sellerListingToListingCard } from '../../api/mappers'
import { filterAnimalListings } from '../../lib/animalListingFilters'
import type { SellerAnimalListingDto } from '../../api/types'

export function SlaughterhouseBuyAnimals() {
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery()
  const [detailId, setDetailId] = useState<number | null>(null)
  const [offerTarget, setOfferTarget] = useState<SellerAnimalListingDto | null>(null)
  const { data, loading, error, reload } = useApi(() => shApi.listAnimalListings(), [])

  const items = useMemo(
    () => filterAnimalListings(data ?? [], { search: searchQuery }),
    [data, searchQuery],
  )

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Hayvan al</h1>
        <p className="text-muted-foreground">Satıcıların açık hayvan ilanları</p>
        {searchQuery.trim() ? (
          <p className="text-small text-muted-foreground mt-2">{items.length} ilan bulundu</p>
        ) : null}
      </div>

      <PageState
        loading={loading}
        error={error}
        onRetry={reload}
        empty={items.length === 0}
        emptyMessage="Açık hayvan ilanı bulunamadı."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const card = sellerListingToListingCard(item)
            return (
              <div key={item.id} className="space-y-2">
                <ListingCard {...card} onClick={() => setDetailId(item.id)} />
                <Button variant="outline" size="sm" className="w-full" onClick={() => setDetailId(item.id)}>
                  Teklif ver
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
    </div>
  )
}
