import { useMemo, useState } from 'react'
import { Eye, Info } from 'lucide-react'
import { Card, CardContent } from '../../components/role-app/Card'
import { Chip } from '../../components/role-app/Chip'
import { ListingCard } from '../../components/role-app/ListingCard'
import { PageState } from '../../components/role-app/PageState'
import { useApi } from '../../hooks/useApi'
import { useSyncedSearchQuery } from '../../hooks/useSyncedSearchQuery'
import * as sellerApi from '../../api/seller'
import { sellerListingToListingCard } from '../../api/mappers'
import { filterAnimalListings } from '../../lib/animalListingFilters'
import { AnimalListingDetailModal } from '../../components/role-app/AnimalListingDetailModal'
import type { AnimalCategory } from '../../api/types'

const categories = [
  { label: 'Tümü', value: null as AnimalCategory | null },
  { label: 'Küçükbaş', value: 'KUCUKBAS' as AnimalCategory },
  { label: 'Büyükbaş', value: 'BUYUKBAS' as AnimalCategory },
]

const sortOptions = [
  { label: 'Yeniden eskiye', value: 'newest' as const },
  { label: 'Fiyat: Düşükten yükseğe', value: 'priceAsc' as const },
  { label: 'Fiyat: Yüksekten düşüğe', value: 'priceDesc' as const },
]

export function SellerBrowse() {
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery()
  const [category, setCategory] = useState<AnimalCategory | null>(null)
  const [sort, setSort] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest')
  const [detailId, setDetailId] = useState<number | null>(null)

  const queryKey = `${category ?? ''}-${sort}`
  const listingsQuery = useApi(
    () => sellerApi.listMarketListings({ category: category ?? undefined, sort }),
    [queryKey],
  )

  const filteredItems = useMemo(
    () => filterAnimalListings(listingsQuery.data ?? [], { search: searchQuery }),
    [listingsQuery.data, searchQuery],
  )

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Pazar durumu</h1>
        <p className="text-muted-foreground">
          Diğer satıcıların ilanlarını inceleyerek pazar fiyatlarını takip edin
        </p>
        {searchQuery.trim() ? (
          <p className="text-small text-muted-foreground mt-2">
            &ldquo;{searchQuery.trim()}&rdquo; için {filteredItems.length} ilan
          </p>
        ) : null}
      </div>

      <Card variant="alt" elevation="none" className="mb-6">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <Info className="size-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-small font-medium mb-1">Bu sayfada sadece görüntüleme yapabilirsiniz</p>
              <p className="text-small text-muted-foreground">
                Diğer hayvan satıcılarının aktif ilanları listelenir. Satıcılar birbirine teklif veremez; teklif
                verme yalnızca kesimhaneler içindir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6" elevation="soft">
        <CardContent className="py-5">
          <div className="space-y-4">
            <div>
              <p className="text-small font-medium mb-3">Hayvan kategorisi</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Chip
                    key={c.label}
                    selected={category === c.value}
                    onClick={() => setCategory(c.value)}
                  >
                    {c.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="text-small font-medium mb-3">Sıralama</p>
              <select
                className="px-3 py-2 text-small border border-border rounded-lg bg-card"
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4">
        <p className="text-small text-muted-foreground">{filteredItems.length} aktif ilan</p>
      </div>

      <PageState
        loading={listingsQuery.loading}
        error={listingsQuery.error}
        onRetry={listingsQuery.reload}
        empty={filteredItems.length === 0}
        emptyMessage="Diğer satıcılardan açık ilan bulunamadı."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const listing = sellerListingToListingCard(item)
            return (
              <div key={listing.id} className="relative group">
                <ListingCard {...listing} onClick={() => setDetailId(item.id)} />
                <div className="absolute inset-0 bg-card/90 backdrop-blur-sm rounded-[var(--radius-card)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="text-center px-4">
                    <Eye className="size-8 text-primary mx-auto mb-2" />
                    <p className="text-small font-medium">Sadece görüntüleme</p>
                    <p className="text-caption text-muted-foreground mt-1">Detay için tıklayın</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </PageState>

      <AnimalListingDetailModal
        listingId={detailId}
        open={detailId != null}
        onClose={() => setDetailId(null)}
        readOnly
      />
    </div>
  )
}
