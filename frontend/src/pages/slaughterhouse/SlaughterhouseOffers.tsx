import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../../components/role-app/Card'
import { Button } from '../../components/role-app/Button'
import { OfferStatusBadge } from '../../components/role-app/OfferStatusBadge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { PageState } from '../../components/role-app/PageState'
import { useApi } from '../../hooks/useApi'
import * as shApi from '../../api/slaughterhouse'
import { formatDateTr, formatHeadCount, formatTry } from '../../api/format'
import { MessageUserButton } from '../../components/role-app/MessageUserButton'
import type { ListingOfferDto } from '../../api/types'

export function SlaughterhouseOffers() {
  const [tab, setTab] = useState<'all' | 'pending'>('all')
  const { data, loading, error, reload } = useApi(() => shApi.listAnimalOffers(), [])
  const offers = data ?? []
  const pending = useMemo(() => offers.filter((o) => o.status === 'PENDING'), [offers])
  const shown = tab === 'pending' ? pending : offers

  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Tekliflerim</h1>
        <p className="text-muted-foreground">Satıcı ilanlarına verdiğiniz teklifler</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tümü ({offers.length})</TabsTrigger>
          <TabsTrigger value="pending">Bekleyen ({pending.length})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <PageState
            loading={loading}
            error={error}
            onRetry={reload}
            empty={shown.length === 0}
            emptyMessage={tab === 'pending' ? 'Bekleyen teklif yok.' : 'Henüz teklif vermediniz.'}
            emptyAction={
              <Link to="/slaughterhouse/buy-animals">
                <Button variant="primary" type="button">
                  {tab === 'pending' ? 'Yeni teklif ver' : 'Hayvan ilanlarına git'}
                </Button>
              </Link>
            }
          >
            <div className="space-y-4">
              {shown.map((offer) => (
                <OfferCard key={offer.offerId} offer={offer} />
              ))}
            </div>
          </PageState>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OfferCard({ offer }: { offer: ListingOfferDto }) {
  return (
    <Card>
      <CardContent className="p-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="font-medium">
            {offer.listingType || 'Hayvan ilanı'}
            {offer.listingCategory ? ` · ${offer.listingCategory}` : ''}
          </h3>
          <p className="text-small text-muted-foreground mt-1">
            Satıcı: {offer.sellerName || '—'}
          </p>
          <p className="text-small mt-1">
            {formatTry(offer.pricePerKg)} / kg
            {offer.quantity != null ? ` · ${formatHeadCount(offer.quantity)}` : ''}
          </p>
          {offer.note ? <p className="text-small text-muted-foreground mt-2">{offer.note}</p> : null}
          <p className="text-caption text-muted-foreground mt-2">{formatDateTr(offer.createdAt)}</p>
          <div className="mt-3">
            <MessageUserButton
              otherUserId={offer.sellerId}
              contextLabel={[offer.listingType, offer.listingCategory].filter(Boolean).join(' · ')}
            />
          </div>
        </div>
        <OfferStatusBadge status={offer.status} />
      </CardContent>
    </Card>
  )
}
