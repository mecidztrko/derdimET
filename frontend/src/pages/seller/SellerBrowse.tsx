import { useMemo, useState } from 'react'
import { Eye, Info, SlidersHorizontal } from 'lucide-react'
import { Button } from '../../components/role-app/Button'
import { Card, CardContent } from '../../components/role-app/Card'
import { Chip } from '../../components/role-app/Chip'
import { Input } from '../../components/role-app/Input'
import { ListingCard } from '../../components/role-app/ListingCard'
import { PageState } from '../../components/role-app/PageState'
import { useApi } from '../../hooks/useApi'
import { useSyncedSearchQuery } from '../../hooks/useSyncedSearchQuery'
import * as sellerApi from '../../api/seller'
import { sellerListingToListingCard } from '../../api/mappers'
import { AnimalListingDetailModal } from '../../components/role-app/AnimalListingDetailModal'
import type { AnimalCategory } from '../../api/types'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

const categories = [
  { label: 'Tümü', value: null as AnimalCategory | null },
  { label: 'Küçükbaş', value: 'KUCUKBAS' as AnimalCategory },
  { label: 'Büyükbaş', value: 'BUYUKBAS' as AnimalCategory },
]

const sortOptions = [
  { label: 'En yeni', value: 'newest' as const },
  { label: 'Fiyat ↑', value: 'priceAsc' as const },
  { label: 'Fiyat ↓', value: 'priceDesc' as const },
]

export function SellerBrowse() {
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery()
  const [category, setCategory] = useState<AnimalCategory | null>(null)
  const [sort, setSort] = useState<'newest' | 'priceAsc' | 'priceDesc'>('newest')
  const [typeFilter, setTypeFilter] = useState('')
  const [ageMin, setAgeMin] = useState('')
  const [ageMax, setAgeMax] = useState('')
  const [quantityMin, setQuantityMin] = useState('')
  const [quantityMax, setQuantityMax] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [showFilters, setShowFilters] = useState(true)
  const [detailId, setDetailId] = useState<number | null>(null)

  const queryKey = useMemo(
    () =>
      [
        searchQuery,
        category,
        sort,
        typeFilter,
        ageMin,
        ageMax,
        quantityMin,
        quantityMax,
        priceMin,
        priceMax,
      ].join('|'),
    [searchQuery, category, sort, typeFilter, ageMin, ageMax, quantityMin, quantityMax, priceMin, priceMax],
  )

  const listingsQuery = useApi(
    () =>
      sellerApi.listMarketListings({
        category: category ?? undefined,
        type: typeFilter || undefined,
        ageMin: ageMin ? Number(ageMin) : undefined,
        ageMax: ageMax ? Number(ageMax) : undefined,
        quantityMin: quantityMin ? Number(quantityMin) : undefined,
        quantityMax: quantityMax ? Number(quantityMax) : undefined,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        sort,
        q: searchQuery,
      }),
    [queryKey],
  )

  const filteredItems = listingsQuery.data ?? []

  return (
    <RoleAppPage>
      <PageHeader title="Pazar durumu" description="Diğer satıcıların aktif hayvan ilanları" />

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

      <div className="mb-4 flex gap-3">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Hayvan türü, ırk veya satıcı ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          type="button"
          onClick={() => setShowFilters((v) => !v)}
        >
          <SlidersHorizontal className="size-4" />
          Filtre
        </Button>
      </div>

      {showFilters ? (
        <Card className="mb-6" elevation="soft">
          <CardContent className="py-5 space-y-4">
            <div>
              <p className="text-small font-medium mb-3">Sıralama</p>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((o) => (
                  <Chip key={o.value} selected={sort === o.value} onClick={() => setSort(o.value)}>
                    {o.label}
                  </Chip>
                ))}
              </div>
            </div>
            <div>
              <p className="text-small font-medium mb-3">Kategori</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <Chip key={c.label} selected={category === c.value} onClick={() => setCategory(c.value)}>
                    {c.label}
                  </Chip>
                ))}
              </div>
            </div>
            <Input
              label="Tür (ör. Merinos)"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              <Input label="Yaş min (ay)" type="number" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} />
              <Input label="Yaş max (ay)" type="number" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} />
              <Input label="Adet min" type="number" value={quantityMin} onChange={(e) => setQuantityMin(e.target.value)} />
              <Input label="Adet max" type="number" value={quantityMax} onChange={(e) => setQuantityMax(e.target.value)} />
              <Input label="Fiyat min (₺)" type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
              <Input label="Fiyat max (₺)" type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      ) : null}

      <p className="text-small text-muted-foreground mb-4">{filteredItems.length} aktif ilan</p>

      <PageState
        loading={listingsQuery.loading}
        error={listingsQuery.error}
        onRetry={listingsQuery.reload}
        empty={filteredItems.length === 0}
        emptyMessage={
          searchQuery.trim()
            ? 'Aramanıza uygun ilan bulunamadı.'
            : 'Diğer satıcılardan açık ilan bulunamadı.'
        }
        emptyAction={
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              setSearchQuery('')
              setCategory(null)
              setTypeFilter('')
              setAgeMin('')
              setAgeMax('')
              setQuantityMin('')
              setQuantityMax('')
              setPriceMin('')
              setPriceMax('')
            }}
          >
            Filtreleri sıfırla
          </Button>
        }
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
    </RoleAppPage>
  )
}
