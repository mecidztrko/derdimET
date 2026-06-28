import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListingCard } from '../../components/role-app/ListingCard'
import { Button } from '../../components/role-app/Button'
import { Card, CardContent } from '../../components/role-app/Card'
import { Chip } from '../../components/role-app/Chip'
import { Input } from '../../components/role-app/Input'
import { PageState } from '../../components/role-app/PageState'
import { useApi } from '../../hooks/useApi'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { useSyncedSearchQuery } from '../../hooks/useSyncedSearchQuery'
import * as shApi from '../../api/slaughterhouse'
import { sellerListingToListingCard } from '../../api/mappers'
import type { AnimalCategory } from '../../api/types'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'
import { SlidersHorizontal } from 'lucide-react'

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

export function SlaughterhouseBuyAnimals() {
  const navigate = useNavigate()
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
  const { blocked: favoriteBlocked } = useEmailVerificationGate()
  const [favoriteError, setFavoriteError] = useState<string | null>(null)

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

  const { data, loading, error, reload } = useApi(
    () =>
      shApi.listAnimalListings({
        q: searchQuery,
        category: category ?? undefined,
        type: typeFilter || undefined,
        ageMin: ageMin ? Number(ageMin) : undefined,
        ageMax: ageMax ? Number(ageMax) : undefined,
        quantityMin: quantityMin ? Number(quantityMin) : undefined,
        quantityMax: quantityMax ? Number(quantityMax) : undefined,
        priceMin: priceMin ? Number(priceMin) : undefined,
        priceMax: priceMax ? Number(priceMax) : undefined,
        sort,
      }),
    [queryKey],
  )

  const items = data ?? []

  return (
    <RoleAppPage>
      <PageHeader title="Hayvan al" description="Satıcılardan hayvan ilanlarını inceleyin" />
      {favoriteError ? (
        <p className="mt-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {favoriteError}
        </p>
      ) : null}

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
            <div className="grid grid-cols-2 gap-3">
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

      <p className="text-small text-muted-foreground mb-4">{items.length} ilan bulundu</p>

      <PageState
        loading={loading}
        error={error}
        onRetry={reload}
        empty={items.length === 0}
        emptyMessage="Aramanıza uygun hayvan ilanı bulunamadı."
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
          {items.map((item) => {
            const card = sellerListingToListingCard(item)
            return (
              <ListingCard
                key={item.id}
                {...card}
                isFavorite={!!item.isFavoritedByMe}
                favoriteUserId={item.id}
                favoriteAddBlocked={favoriteBlocked}
                onFavoriteToggle={(id) => {
                  setFavoriteError(null)
                  void shApi
                    .toggleAnimalListingFavorite(id)
                    .then(() => reload())
                    .catch((e) =>
                      setFavoriteError(e instanceof Error ? e.message : 'Favori güncellenemedi'),
                    )
                }}
                onClick={() => navigate(`/slaughterhouse/listings/${item.id}`)}
              />
            )
          })}
        </div>
      </PageState>
    </RoleAppPage>
  )
}
