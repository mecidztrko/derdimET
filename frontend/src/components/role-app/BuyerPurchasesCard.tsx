import { useState } from 'react'
import * as buyerApi from '../../api/buyer'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { OrderStatusBadge } from './OrderStatusBadge'
import { PageState } from './PageState'
import { MessageUserButton } from './MessageUserButton'
import { useApi } from '../../hooks/useApi'
import { formatDateTr, formatKg, formatTry } from '../../api/format'

type BuyerPurchasesCardProps = {
  limit?: number
  compact?: boolean
}

export function BuyerPurchasesCard({ limit = 20, compact = false }: BuyerPurchasesCardProps) {
  const { data, loading, error, reload } = useApi(() => buyerApi.listPurchases(limit), [limit])
  const [actionId, setActionId] = useState<number | null>(null)
  const items = data ?? []

  async function handlePayment(orderId: number) {
    setActionId(orderId)
    try {
      await buyerApi.confirmOrderPayment(orderId)
      reload()
    } finally {
      setActionId(null)
    }
  }

  async function handleComplete(orderId: number) {
    setActionId(orderId)
    try {
      await buyerApi.completeOrder(orderId)
      reload()
    } finally {
      setActionId(null)
    }
  }

  return (
    <Card className={compact ? 'mt-6' : 'mt-8'}>
      <CardContent className="p-6">
        <h3 className="mb-2 font-medium">
          {compact ? 'Son siparişler' : 'Siparişlerim'}
        </h3>
        {!compact ? (
          <p className="text-small text-muted-foreground mb-6">
            Kabul edilen tekliflerden ödeme ve teslimat adımlarını buradan yönetin
          </p>
        ) : null}
        <PageState
          loading={loading}
          error={error}
          onRetry={reload}
          empty={items.length === 0}
          emptyMessage="Henüz siparişiniz yok. Kabul edilen teklifler burada görünür."
        >
          <div className="space-y-3">
            {items.map((o) => {
              const key = o.orderId ?? o.meatOfferId ?? o.createdAt
              const canPay = o.orderId != null && (o.status === 'PAYMENT_PENDING' || o.status === 'PENDING')
              const canComplete = o.orderId != null && o.status === 'PAYMENT_CONFIRMED'
              return (
                <div key={key} className="p-4 rounded-lg border border-border">
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div>
                      <p className="font-medium text-small">{o.saleTitle || 'Et siparişi'}</p>
                      <p className="text-caption text-muted-foreground">
                        {o.slaughterhouseCompanyName || o.slaughterhouseName || 'Kesimhane'}
                      </p>
                    </div>
                    <OrderStatusBadge status={o.status ?? 'COMPLETED'} />
                  </div>
                  <p className="text-small">
                    {formatTry(o.pricePerKg)} / kg · {formatKg(o.quantity)} · Toplam {formatTry(o.totalPrice)}
                  </p>
                  <p className="text-caption text-muted-foreground mt-1">{formatDateTr(o.createdAt)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {canPay ? (
                      <Button
                        variant="primary"
                        size="sm"
                        type="button"
                        disabled={actionId === o.orderId}
                        onClick={() => o.orderId != null && void handlePayment(o.orderId)}
                      >
                        {actionId === o.orderId ? 'İşleniyor…' : 'Ödemeyi onayla (mock)'}
                      </Button>
                    ) : null}
                    {canComplete ? (
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        disabled={actionId === o.orderId}
                        onClick={() => o.orderId != null && void handleComplete(o.orderId)}
                      >
                        Teslimatı tamamla
                      </Button>
                    ) : null}
                    <MessageUserButton
                      otherUserId={o.slaughterhouseId}
                      contextLabel={o.saleTitle ?? 'Et siparişi'}
                    />
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
