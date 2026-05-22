import { Link } from 'react-router-dom'
import { ChevronRight, TrendingUp } from 'lucide-react'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { Badge } from './Badge'
import { OfferStatusBadge } from './OfferStatusBadge'
import { PageState } from './PageState'
import { useApi } from '../../hooks/useApi'
import { listSales } from '../../api/seller'
import { formatDateTr, formatHeadCount, formatTry } from '../../api/format'
import { MessageUserButton } from './MessageUserButton'

type SellerSalesCardProps = {
  limit?: number
  compact?: boolean
}

export function SellerSalesCard({ limit = 20, compact = false }: SellerSalesCardProps) {
  const { data, loading, error, reload } = useApi(() => listSales(limit), [limit])
  const items = data ?? []

  return (
    <Card className={compact ? 'mt-6' : 'mt-8'}>
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <h3 className="flex items-center gap-2">
            <TrendingUp className="size-5" />
            {compact ? 'Son satışlar' : 'Kabul edilen satışlar'}
          </h3>
          {compact && items.length > 0 ? (
            <Link to="/seller/settings">
              <Button variant="ghost" size="sm" type="button">
                Tümü <ChevronRight className="size-4 ml-1" />
              </Button>
            </Link>
          ) : null}
        </div>
        {!compact ? (
          <p className="text-small text-muted-foreground mb-6">
            Kabul edilen alış talebi ve doğrudan ilan satışları
          </p>
        ) : (
          <p className="text-small text-muted-foreground mb-4">
            Kesimhane ile tamamlanan hayvan satışları
          </p>
        )}
        <PageState
          loading={loading}
          error={error}
          onRetry={reload}
          empty={items.length === 0}
          emptyMessage="Henüz kabul edilmiş teklifiniz yok."
          emptyAction={
            <Link to="/seller">
              <Button variant="primary" type="button">
                Kesimhane taleplerine git
              </Button>
            </Link>
          }
        >
          <div className="space-y-3">
            {items.map((s) => {
              const title =
                s.saleType === 'DIRECT_LISTING'
                  ? s.listingTitle || 'Hayvan ilanı'
                  : s.requestTitle || 'Alış talebi'
              const typeLabel = s.saleType === 'DIRECT_LISTING' ? 'İlan satışı' : 'Alış talebi'
              return (
                <div key={`${s.saleType}-${s.offerId}`} className="p-4 rounded-lg border border-border">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                    <p className="font-medium text-small">{title}</p>
                    <div className="flex gap-2">
                      <Badge variant="default">{typeLabel}</Badge>
                      <OfferStatusBadge status={s.status} />
                    </div>
                  </div>
                  <p className="text-caption text-muted-foreground">
                    {s.slaughterhouseCompanyName || s.slaughterhouseName || 'Kesimhane'}
                  </p>
                  <p className="text-small mt-2">
                    {formatTry(s.pricePerKg)} / kg
                    {s.animalCount != null ? ` · ${formatHeadCount(s.animalCount)}` : ''}
                    {s.estimatedTotal != null ? ` · Tahmini ${formatTry(s.estimatedTotal)}` : ''}
                  </p>
                  <p className="text-caption text-muted-foreground mt-1">{formatDateTr(s.createdAt)}</p>
                  <div className="mt-3">
                    <MessageUserButton otherUserId={s.slaughterhouseId} contextLabel={title} />
                  </div>
                </div>
              )
            })}
          </div>
        </PageState>
      </CardContent>
    </Card>
  )
}
