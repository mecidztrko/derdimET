import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListingCard } from '../../components/role-app/ListingCard'
import { Button } from '../../components/role-app/Button'
import { PageState } from '../../components/role-app/PageState'
import { useApi } from '../../hooks/useApi'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { useSyncedSearchQuery } from '../../hooks/useSyncedSearchQuery'
import * as shApi from '../../api/slaughterhouse'
import { sellerListingToListingCard } from '../../api/mappers'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

export function SlaughterhouseBuyAnimals() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery()
  const { data, loading, error, reload } = useApi(
    () => shApi.listAnimalListings({ q: searchQuery }),
    [searchQuery],
  )
  const { blocked: favoriteBlocked } = useEmailVerificationGate()
  const [favoriteError, setFavoriteError] = useState<string | null>(null)

  const items = data ?? []

  return (
    <RoleAppPage>
      <PageHeader title="Hayvan al" description="Satıcılardan hayvan ilanlarını inceleyin" />
        {favoriteError ? (
          <p className="mt-2 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {favoriteError}
          </p>
        ) : null}
        {searchQuery.trim() ? (
          <p className="text-small text-muted-foreground mt-2">{items.length} ilan bulundu</p>
        ) : null}

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