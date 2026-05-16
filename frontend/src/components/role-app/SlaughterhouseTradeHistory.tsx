import { Package, ShoppingCart } from 'lucide-react'
import { Card, CardContent } from './Card'
import { Badge } from './Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'
import { PageState } from './PageState'
import { MessageUserButton } from './MessageUserButton'
import { useApi } from '../../hooks/useApi'
import { listProfilePurchases, listProfileSales } from '../../api/slaughterhouse'
import { formatDateTr, formatHeadCount, formatKg, formatTry } from '../../api/format'

export function SlaughterhouseTradeHistory() {
  const purchases = useApi(() => listProfilePurchases(20), [])
  const sales = useApi(() => listProfileSales(20), [])

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h3 className="mb-6">İşlem geçmişi</h3>
        <Tabs defaultValue="sales">
          <TabsList className="mb-4">
            <TabsTrigger value="sales">
              <Package className="size-4 mr-2" />
              Et satışları ({sales.data?.length ?? 0})
            </TabsTrigger>
            <TabsTrigger value="purchases">
              <ShoppingCart className="size-4 mr-2" />
              Hayvan alımları ({purchases.data?.length ?? 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <PageState
              loading={sales.loading}
              error={sales.error}
              onRetry={sales.reload}
              empty={(sales.data?.length ?? 0) === 0}
              emptyMessage="Henüz tamamlanmış et satışı yok. Alıcı teklifini kabul edince sipariş oluşur."
            >
              <div className="space-y-3">
                {(sales.data ?? []).map((o) => (
                  <div key={o.orderId} className="p-4 rounded-lg border border-border">
                    <div className="flex flex-wrap justify-between gap-2 mb-1">
                      <p className="font-medium text-small">{o.saleTitle || 'Et satışı'}</p>
                      <Badge variant="success">{o.status ?? 'COMPLETED'}</Badge>
                    </div>
                    <p className="text-caption text-muted-foreground">
                      Alıcı: {o.buyerName || '—'}
                      {o.meatType ? ` · ${o.meatType}` : ''}
                    </p>
                    <p className="text-small mt-2">Toplam {formatTry(o.totalPrice)}</p>
                    <p className="text-caption text-muted-foreground mt-1">
                      {formatDateTr(o.createdAt)}
                    </p>
                    <div className="mt-3">
                      <MessageUserButton
                        otherUserId={o.buyerId}
                        contextLabel={o.saleTitle ?? 'Et satışı'}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </PageState>
          </TabsContent>

          <TabsContent value="purchases">
            <PageState
              loading={purchases.loading}
              error={purchases.error}
              onRetry={purchases.reload}
              empty={(purchases.data?.length ?? 0) === 0}
              emptyMessage="Henüz kabul edilmiş hayvan alımı yok."
            >
              <div className="space-y-3">
                {(purchases.data ?? []).map((p) => {
                  const title =
                    p.purchaseType === 'DIRECT_LISTING'
                      ? p.listingTitle || 'Hayvan ilanı'
                      : p.requestTitle || 'Alış talebi'
                  const typeLabel =
                    p.purchaseType === 'DIRECT_LISTING' ? 'Satıcı ilanı' : 'Alış talebi'
                  return (
                  <div key={`${p.purchaseType}-${p.offerId}`} className="p-4 rounded-lg border border-border">
                    <div className="flex flex-wrap justify-between gap-2 mb-1">
                      <p className="font-medium text-small">{title}</p>
                      <div className="flex gap-2">
                        <Badge variant="default">{typeLabel}</Badge>
                        <Badge variant="accepted">{p.status}</Badge>
                      </div>
                    </div>
                    <p className="text-caption text-muted-foreground">
                      Satıcı: {p.sellerCompanyName || p.sellerName || '—'}
                    </p>
                    <p className="text-small mt-2">
                      {formatTry(p.pricePerKg)} / kg
                      {p.animalCount != null ? ` · ${formatHeadCount(p.animalCount)}` : ''}
                      {p.estimatedTotal != null ? ` · Tahmini ${formatTry(p.estimatedTotal)}` : ''}
                    </p>
                    <p className="text-caption text-muted-foreground mt-1">
                      {formatDateTr(p.createdAt)}
                    </p>
                    <div className="mt-3">
                      <MessageUserButton otherUserId={p.sellerId} contextLabel={title} />
                    </div>
                  </div>
                )})}
              </div>
            </PageState>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
