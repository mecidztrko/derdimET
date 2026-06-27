import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from '../../components/role-app/Card'
import { Chip } from '../../components/role-app/Chip'
import { Input } from '../../components/role-app/Input'
import { Button } from '../../components/role-app/Button'
import { ListingCard } from '../../components/role-app/ListingCard'
import { PageState } from '../../components/role-app/PageState'
import { Search, SlidersHorizontal, MapPin } from 'lucide-react'
import { useApi } from '../../hooks/useApi'
import { useSyncedSearchQuery } from '../../hooks/useSyncedSearchQuery'
import * as buyerApi from '../../api/buyer'
import { meatSaleToListingCard } from '../../api/mappers'
import { filterMeatListings } from '../../lib/meatListingFilters'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { PageHeader } from '../../components/role-app/PageHeader'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'

const meatTypes = ['Tümü', 'Dana', 'Kuzu', 'Kıyma', 'Biftek', 'Pirzola', 'But', 'Antrikot']

export function BuyerSearch() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery()
  const [selectedMeatType, setSelectedMeatType] = useState('Tümü')
  const [selectedCity, setSelectedCity] = useState('Tüm Şehirler')
  const [showFilters, setShowFilters] = useState(true)
  const [favoriteError, setFavoriteError] = useState<string | null>(null)
  const { blocked: favoriteBlocked } = useEmailVerificationGate()

  const { data, loading, error, reload } = useApi(
    () => buyerApi.listMeatSaleRequests({ q: searchQuery }),
    [searchQuery],
  )

  const cities = useMemo(() => {
    const set = new Set<string>()
    for (const item of data ?? []) {
      if (item.slaughterhouseCity) set.add(item.slaughterhouseCity)
    }
    return ['Tüm Şehirler', ...Array.from(set).sort()]
  }, [data])

  const filtered = useMemo(
    () =>
      filterMeatListings(data ?? [], {
        meatType: selectedMeatType,
        city: selectedCity,
      }),
    [data, selectedMeatType, selectedCity],
  )

  async function handleFavorite(listingId: number) {
    setFavoriteError(null)
    try {
      await buyerApi.toggleMeatListingFavorite(listingId)
      reload()
    } catch (e) {
      setFavoriteError(e instanceof Error ? e.message : 'Favori işlemi başarısız')
    }
  }

  return (
    <RoleAppPage>
      <PageHeader
        title="Et Ürünleri Ara"
        description="Kesimhanelerden taze et ilanlarını keşfedin"
      />
      {favoriteError ? (
        <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {favoriteError}
        </p>
      ) : null}
      {searchQuery.trim() ? (
        <p className="text-small text-muted-foreground -mt-4 mb-6">
          &ldquo;{searchQuery.trim()}&rdquo; için {filtered.length} ilan
        </p>
      ) : null}

      <div className="mb-6 flex gap-3">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Ürün adı, kesimhane, şehir ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="size-5 mr-2" />
          Filtreler
        </Button>
      </div>

      {showFilters && (
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
              {cities.length > 1 && (
                <div>
                  <p className="text-small font-medium mb-3">
                    <MapPin className="size-4 inline mr-1" />
                    Şehir
                  </p>
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
      )}

      <div className="mb-4">
        <p className="text-small text-muted-foreground">{filtered.length} ilan bulundu</p>
      </div>

      <PageState
        loading={loading}
        error={error}
        onRetry={reload}
        empty={filtered.length === 0}
        emptyMessage="Aramanıza uygun ilan bulunamadı."
        emptyAction={
          <Button variant="secondary" type="button" onClick={() => setSearchQuery('')}>
            Aramayı temizle
          </Button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const listing = meatSaleToListingCard(item)
            return (
              <ListingCard
                key={listing.id}
                {...listing}
                showSlaughterhouseLabel
                isFavorite={!!item.isFavoritedByMe}
                favoriteUserId={item.id}
                favoriteAddBlocked={favoriteBlocked}
                onFavoriteToggle={(id) => void handleFavorite(id)}
                onClick={() => navigate(`/buyer/listings/${item.id}`)}
              />
            )
          })}
        </div>
      </PageState>

    </RoleAppPage>
  )
}
