import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../../components/role-app/Card'
import { Button } from '../../components/role-app/Button'
import { OfferStatusBadge } from '../../components/role-app/OfferStatusBadge'
import { OfferHistoryModal } from '../../components/role-app/OfferHistoryModal'
import { OfferRevisionActions } from '../../components/role-app/OfferRevisionActions'
import { OfferRevisionMeta } from '../../components/role-app/OfferRevisionMeta'
import { OfferReviseModal } from '../../components/role-app/OfferReviseModal'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { PageState } from '../../components/role-app/PageState'
import { useApi } from '../../hooks/useApi'
import * as shApi from '../../api/slaughterhouse'
import { formatDateTr, formatHeadCount, formatTry } from '../../api/format'
import { MessageUserButton } from '../../components/role-app/MessageUserButton'
import type { ListingOfferDto } from '../../api/types'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

export function SlaughterhouseOffers() {
  const [tab, setTab] = useState<'all' | 'pending'>('all')
  const { data, loading, error, reload } = useApi(() => shApi.listAnimalOffers(), [])
  const [reviseOffer, setReviseOffer] = useState<ListingOfferDto | null>(null)
  const [historyOfferId, setHistoryOfferId] = useState<number | null>(null)

  const offers = data ?? []
  const pending = useMemo(() => offers.filter((o) => o.status === 'PENDING'), [offers])
  const shown = tab === 'pending' ? pending : offers

  return (
    <RoleAppPage>
      <PageHeader title="Tekliflerim" description="Verdiğiniz hayvan ilanı teklifleri" />

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
                <OfferCard
                  key={offer.offerId}
                  offer={offer}
                  onRevise={() => setReviseOffer(offer)}
                  onHistory={() => setHistoryOfferId(offer.offerId)}
                />
              ))}
            </div>
          </PageState>
        </TabsContent>
      </Tabs>

      <OfferReviseModal
        open={reviseOffer != null}
        title={`${reviseOffer?.listingType || 'Hayvan'} ilanı`}
        quantityLabel="Adet"
        initialPrice={reviseOffer?.pricePerKg}
        initialQuantity={reviseOffer?.quantity}
        initialNote={reviseOffer?.note}
        onClose={() => setReviseOffer(null)}
        onSubmit={async (body) => {
          if (!reviseOffer) return
          await shApi.reviseListingOffer(reviseOffer.offerId, body)
          setReviseOffer(null)
          reload()
        }}
      />
      <OfferHistoryModal
        open={historyOfferId != null}
        offerId={historyOfferId}
        onClose={() => setHistoryOfferId(null)}
        loadHistory={shApi.listListingOfferHistory}
      />
    </RoleAppPage>
  )
}

function OfferCard({
  offer,
  onRevise,
  onHistory,
}: {
  offer: ListingOfferDto
  onRevise: () => void
  onHistory: () => void
}) {
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
          <OfferRevisionMeta revisionNumber={offer.revisionNumber} expiresAt={offer.expiresAt} />
          <p className="text-caption text-muted-foreground mt-1">{formatDateTr(offer.createdAt)}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <OfferRevisionActions
              pending={offer.status === 'PENDING'}
              onRevise={onRevise}
              onHistory={onHistory}
            />
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
