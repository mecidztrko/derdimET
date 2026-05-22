import { Link } from 'react-router-dom'
import { User, X } from 'lucide-react'
import { Card, CardContent } from './Card'
import { Button } from './Button'
import { PageState } from './PageState'
import { useApi } from '../../hooks/useApi'
import { useToggleFavorite } from '../../hooks/useToggleFavorite'
import { listFavoriteSellers } from '../../api/slaughterhouse'
import { formatDateTr } from '../../api/format'

export function SlaughterhouseFavoriteSellers() {
  const { data, loading, error, reload } = useApi(() => listFavoriteSellers(), [])
  const { toggle: toggleFavorite, error: favoriteError } = useToggleFavorite()
  const items = data ?? []

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h3 className="mb-2">Favori satıcılar</h3>
        <p className="text-small text-muted-foreground mb-4">
          Hayvan al sayfasındaki ilan kartlarından kalp ikonu ile ekleyebilirsiniz.
        </p>
        {favoriteError ? (
          <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
            {favoriteError}
          </p>
        ) : null}
        <PageState
          loading={loading}
          error={error}
          onRetry={reload}
          empty={items.length === 0}
          emptyMessage="Henüz favori satıcınız yok."
          emptyAction={
            <Link to="/slaughterhouse/buy-animals">
              <Button variant="primary" type="button">
                Hayvan ilanlarına git
              </Button>
            </Link>
          }
        >
          <div className="space-y-3">
            {items.map((seller) => (
              <div
                key={seller.sellerId}
                className="flex items-start gap-3 p-4 rounded-lg border border-border"
              >
                <div className="size-10 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                  <User className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-small">{seller.sellerName || 'Satıcı'}</p>
                  {seller.sellerEmail ? (
                    <p className="text-caption text-muted-foreground mt-1">{seller.sellerEmail}</p>
                  ) : null}
                  <p className="text-caption text-muted-foreground mt-1">
                    Favorilendi: {formatDateTr(seller.createdAt)}
                  </p>
                </div>
                {seller.sellerId != null ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    aria-label="Favoriden çıkar"
                    onClick={() => void toggleFavorite(seller.sellerId!, true).then(() => reload())}
                  >
                    <X className="size-5 text-muted-foreground" />
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
        </PageState>
      </CardContent>
    </Card>
  )
}
