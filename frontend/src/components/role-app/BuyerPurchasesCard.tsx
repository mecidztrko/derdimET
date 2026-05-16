import { Link } from 'react-router-dom'
import { ChevronRight, ShoppingBag } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { Badge } from './Badge'
import { PageState } from './PageState'
import { MessageUserButton } from './MessageUserButton'
import { useApi } from '../../hooks/useApi'
import { listPurchases } from '../../api/buyer'
import { formatDateTr, formatKg, formatTry } from '../../api/format'

type BuyerPurchasesCardProps = {
  limit?: number
  compact?: boolean
}

export function BuyerPurchasesCard({ limit = 20, compact = false }: BuyerPurchasesCardProps) {
  const { data, loading, error, reload } = useApi(() => listPurchases(limit), [limit])
  const items = data ?? []

  return (
    <Card className={compact ? 'mt-6' : 'mt-8'}>
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h3 className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            {compact ? 'Son siparişler' : 'Tamamlanan alımlarım'}
          </h3>
          {compact && items.length > 0 ? (
            <Link to="/buyer/settings">
              <Button variant="ghost" size="sm" type="button">
                Tümü <ChevronRight className="size-4 ml-1" />
              </Button>
            </Link>
          ) : null}
        </div>
        {!compact ? (
          <p className="text-small text-muted-foreground mb-6">
            Kesimhane teklifinizi kabul ettiğinde oluşan siparişler
          </p>
        ) : (
          <p className="text-small text-muted-foreground mb-4">
            Kabul edilen et tekliflerinden oluşan siparişler
          </p>
        )}
        <PageState
          loading={loading}
          error={error}
          onRetry={reload}
          empty={items.length === 0}
          emptyMessage="Henüz tamamlanmış siparişiniz yok. Kabul edilen teklifler burada görünür."
        >
          <div className="space-y-3">
            {items.map((o) => (
              <div key={o.orderId} className="p-4 rounded-lg border border-border">
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-medium text-small">{o.saleTitle || 'Et siparişi'}</p>
                    <p className="text-caption text-muted-foreground">
                      {o.slaughterhouseCompanyName || o.slaughterhouseName || 'Kesimhane'}
                      {o.meatType ? ` · ${o.meatType}` : ''}
                    </p>
                  </div>
                  <Badge variant="success">{o.status}</Badge>
                </div>
                <p className="text-small">
                  {formatTry(o.pricePerKg)} / kg · {formatKg(o.quantity)} · Toplam{' '}
                  {formatTry(o.totalPrice)}
                </p>
                <p className="text-caption text-muted-foreground mt-1">{formatDateTr(o.createdAt)}</p>
                <div className="mt-3">
                  <MessageUserButton
                    otherUserId={o.slaughterhouseId}
                    contextLabel={o.saleTitle ?? 'Et siparişi'}
                  />
                </div>
              </div>
            ))}
          </div>
        </PageState>
      </CardContent>
    </Card>
  )
}
