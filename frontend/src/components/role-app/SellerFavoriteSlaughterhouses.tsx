import { Factory, MapPin } from 'lucide-react'
import { Card, CardContent } from './Card'
import { PageState } from './PageState'
import { useApi } from '../../hooks/useApi'
import { listFavoriteSlaughterhouses } from '../../api/seller'
import { formatDateTr } from '../../api/format'

export function SellerFavoriteSlaughterhouses() {
  const { data, loading, error, reload } = useApi(() => listFavoriteSlaughterhouses(), [])
  const items = data ?? []

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h3 className="mb-2">Favori kesimhaneler</h3>
        <p className="text-small text-muted-foreground mb-6">
          Pazar ekranındaki alış taleplerinde kalp ikonuna basarak ekleyebilirsiniz.
        </p>
        <PageState
          loading={loading}
          error={error}
          onRetry={reload}
          empty={items.length === 0}
          emptyMessage="Henüz favori kesimhaneniz yok."
        >
          <div className="space-y-3">
            {items.map((sh) => (
              <div
                key={sh.buyerId}
                className="flex items-start gap-3 p-4 rounded-lg border border-border"
              >
                <div className="size-10 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                  <Factory className="size-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-small">{sh.buyerName || 'Kesimhane'}</p>
                  {sh.buyerEmail ? (
                    <p className="text-caption text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="size-3" />
                      {sh.buyerEmail}
                    </p>
                  ) : null}
                  <p className="text-caption text-muted-foreground mt-1">
                    Favorilendi: {formatDateTr(sh.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PageState>
      </CardContent>
    </Card>
  )
}
