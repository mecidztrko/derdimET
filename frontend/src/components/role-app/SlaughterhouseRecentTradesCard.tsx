import { Link } from 'react-router-dom'
import { History, ChevronRight } from 'lucide-react'
import { Card, CardContent } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'
import { PageState } from './PageState'
import { MessageUserButton } from './MessageUserButton'
import { useApi } from '../../hooks/useApi'
import { listProfilePurchases, listProfileSales } from '../../api/slaughterhouse'
import { formatDateTr, formatHeadCount, formatTry } from '../../api/format'

const PREVIEW = 4

export function SlaughterhouseRecentTradesCard() {
  const purchases = useApi(() => listProfilePurchases(PREVIEW), [])
  const sales = useApi(() => listProfileSales(PREVIEW), [])

  const purchaseItems = purchases.data ?? []
  const saleItems = sales.data ?? []

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h3 className="flex items-center gap-2">
            <History className="size-5" />
            Son işlemler
          </h3>
          <Link to="/slaughterhouse/settings">
            <Button variant="ghost" size="sm" type="button">
              Tüm geçmiş <ChevronRight className="size-4 ml-1" />
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="purchases">
          <TabsList className="mb-4">
            <TabsTrigger value="purchases">Hayvan alımları ({purchaseItems.length})</TabsTrigger>
            <TabsTrigger value="sales">Et satışları ({saleItems.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="purchases">
            <PageState
              loading={purchases.loading}
              error={purchases.error}
              onRetry={purchases.reload}
              empty={purchaseItems.length === 0}
              emptyMessage="Henüz tamamlanmış hayvan alımı yok."
              emptyAction={
                <Link to="/slaughterhouse/buy-animals">
                  <Button variant="primary" type="button">
                    Hayvan ilanlarına git
                  </Button>
                </Link>
              }
            >
              <div className="space-y-3">
                {purchaseItems.map((p) => {
                  const title =
                    p.purchaseType === 'DIRECT_LISTING'
                      ? p.listingTitle || 'Hayvan ilanı'
                      : p.requestTitle || 'Alış talebi'
                  const typeLabel =
                    p.purchaseType === 'DIRECT_LISTING' ? 'Satıcı ilanı' : 'Alış talebi'
                  return (
                    <div
                      key={`${p.purchaseType}-${p.offerId}`}
                      className="p-4 rounded-lg border border-border flex flex-wrap justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="font-medium text-small">{title}</p>
                          <Badge variant="default">{typeLabel}</Badge>
                        </div>
                        <p className="text-caption text-muted-foreground">
                          {p.sellerCompanyName || p.sellerName || 'Satıcı'}
                        </p>
                        <p className="text-small mt-1">
                          {formatTry(p.pricePerKg)} / kg
                          {p.animalCount != null ? ` · ${formatHeadCount(p.animalCount)}` : ''}
                        </p>
                        <p className="text-caption text-muted-foreground mt-1">
                          {formatDateTr(p.createdAt)}
                        </p>
                      </div>
                      <MessageUserButton otherUserId={p.sellerId} contextLabel={title} />
                    </div>
                  )
                })}
              </div>
            </PageState>
          </TabsContent>

          <TabsContent value="sales">
            <PageState
              loading={sales.loading}
              error={sales.error}
              onRetry={sales.reload}
              empty={saleItems.length === 0}
              emptyMessage="Henüz tamamlanmış et satışı yok."
              emptyAction={
                <Link to="/slaughterhouse/sell-meat">
                  <Button variant="primary" type="button">
                    Et ilanlarına git
                  </Button>
                </Link>
              }
            >
              <div className="space-y-3">
                {saleItems.map((o) => (
                  <div
                    key={o.orderId}
                    className="p-4 rounded-lg border border-border flex flex-wrap justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-small">{o.saleTitle || 'Et satışı'}</p>
                      <p className="text-caption text-muted-foreground">
                        Alıcı: {o.buyerName || '—'}
                        {o.meatType ? ` · ${o.meatType}` : ''}
                      </p>
                      <p className="text-small mt-1">{formatTry(o.totalPrice)}</p>
                      <p className="text-caption text-muted-foreground mt-1">
                        {formatDateTr(o.createdAt)}
                      </p>
                    </div>
                    <MessageUserButton
                      otherUserId={o.buyerId}
                      contextLabel={o.saleTitle ?? 'Et satışı'}
                    />
                  </div>
                ))}
              </div>
            </PageState>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
