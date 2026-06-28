import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '../../components/role-app/Card'
import { OfferStatusBadge } from '../../components/role-app/OfferStatusBadge'
import { OfferHistoryModal } from '../../components/role-app/OfferHistoryModal'
import { OfferRevisionActions } from '../../components/role-app/OfferRevisionActions'
import { OfferRevisionMeta } from '../../components/role-app/OfferRevisionMeta'
import { OfferReviseModal } from '../../components/role-app/OfferReviseModal'
import { Button } from '../../components/role-app/Button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { PageState } from '../../components/role-app/PageState'
import { useApi } from '../../hooks/useApi'
import * as sellerApi from '../../api/seller'
import { formatDateTr, formatHeadCount, formatTry } from '../../api/format'
import { MessageUserButton } from '../../components/role-app/MessageUserButton'
import { RespondToOfferButtons } from '../../components/role-app/RespondToOfferButtons'
import { ApiError } from '../../api/client'
import type { ListingOfferDto, SellerAnimalOfferItemDto } from '../../api/types'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

export function SellerOffers() {
  const [tab, setTab] = useState('incoming')
  const [actingId, setActingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const incoming = useApi(() => sellerApi.listIncomingListingOffers(), [])
  const outgoing = useApi(() => sellerApi.listMyAnimalOffers(), [])
  const listings = useApi(() => sellerApi.listMyAnimalListings(), [])
  const [reviseOffer, setReviseOffer] = useState<SellerAnimalOfferItemDto | null>(null)
  const [historyOfferId, setHistoryOfferId] = useState<number | null>(null)
  const [historySource, setHistorySource] = useState<'incoming' | 'outgoing'>('outgoing')

  async function handleListingOffer(offerId: number, accept: boolean) {
    setActingId(offerId)
    setActionError(null)
    try {
      if (accept) await sellerApi.acceptListingOffer(offerId)
      else await sellerApi.rejectListingOffer(offerId)
      incoming.reload()
      listings.reload()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'İşlem başarısız')
    } finally {
      setActingId(null)
    }
  }

  return (
    <RoleAppPage>
      <PageHeader title="Teklifler" description="Gelen ve giden teklifleriniz" />
      {actionError ? (
        <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {actionError}
        </p>
      ) : null}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="incoming">İlanlarıma gelen</TabsTrigger>
          <TabsTrigger value="outgoing">Kesimhane taleplerine verdiğim</TabsTrigger>
        </TabsList>

        <TabsContent value="incoming">
          <OffersList
            loading={incoming.loading}
            error={incoming.error}
            reload={incoming.reload}
            empty={(incoming.data?.length ?? 0) === 0}
            emptyMessage="İlanlarınıza henüz teklif gelmedi."
            emptyAction={
              <Link to="/seller/listings">
                <Button variant="primary" type="button">
                  İlan oluştur veya yönet
                </Button>
              </Link>
            }
          >
            {(incoming.data ?? []).map((o) => (
              <IncomingOfferCard
                key={o.offerId}
                offer={o}
                acting={actingId === o.offerId}
                onAccept={() => void handleListingOffer(o.offerId, true)}
                onReject={() => void handleListingOffer(o.offerId, false)}
                onHistory={() => {
                  setHistorySource('incoming')
                  setHistoryOfferId(o.offerId)
                }}
              />
            ))}
          </OffersList>
        </TabsContent>

        <TabsContent value="outgoing">
          <OffersList
            loading={outgoing.loading}
            error={outgoing.error}
            reload={outgoing.reload}
            empty={(outgoing.data?.length ?? 0) === 0}
            emptyMessage="Henüz kesimhane alış talebine teklif vermediniz."
            emptyAction={
              <Link to="/seller">
                <Button variant="primary" type="button">
                  Kesimhane taleplerine git
                </Button>
              </Link>
            }
          >
            {(outgoing.data ?? []).map((o) => (
              <OutgoingOfferCard
                key={o.offerId}
                offer={o}
                onRevise={() => setReviseOffer(o)}
                onHistory={() => {
                  setHistorySource('outgoing')
                  setHistoryOfferId(o.offerId)
                }}
              />
            ))}
          </OffersList>
        </TabsContent>
      </Tabs>

      <OfferReviseModal
        open={reviseOffer != null}
        title={reviseOffer?.request.title ?? 'Alış talebi'}
        quantityLabel="Adet"
        initialPrice={reviseOffer?.pricePerKg}
        initialQuantity={reviseOffer?.animalCount}
        initialNote={reviseOffer?.note}
        onClose={() => setReviseOffer(null)}
        onSubmit={async (body) => {
          if (!reviseOffer) return
          await sellerApi.reviseAnimalOffer(reviseOffer.offerId, body)
          setReviseOffer(null)
          outgoing.reload()
        }}
      />
      <OfferHistoryModal
        open={historyOfferId != null}
        offerId={historyOfferId}
        onClose={() => setHistoryOfferId(null)}
        loadHistory={(id) =>
          historySource === 'incoming'
            ? sellerApi.listIncomingListingOfferHistory(id)
            : sellerApi.listAnimalOfferHistory(id)
        }
      />
    </RoleAppPage>
  )
}

function OffersList({
  loading,
  error,
  reload,
  empty,
  emptyMessage,
  emptyAction,
  children,
}: {
  loading: boolean
  error: string | null
  reload: () => void
  empty: boolean
  emptyMessage: string
  emptyAction?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <PageState
      loading={loading}
      error={error}
      onRetry={reload}
      empty={empty}
      emptyMessage={emptyMessage}
      emptyAction={emptyAction}
    >
      <div className="space-y-4">{children}</div>
    </PageState>
  )
}

function IncomingOfferCard({
  offer,
  acting,
  onAccept,
  onReject,
  onHistory,
}: {
  offer: ListingOfferDto
  acting: boolean
  onAccept: () => void
  onReject: () => void
  onHistory: () => void
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-medium">{offer.slaughterhouseName || 'Kesimhane'}</h3>
            <p className="text-small text-muted-foreground">
              {offer.listingType}
              {offer.listingCategory ? ` · ${offer.listingCategory}` : ''}
            </p>
            <p className="text-small mt-1">
              {formatTry(offer.pricePerKg)} / kg
              {offer.quantity != null ? ` · ${formatHeadCount(offer.quantity)}` : ''}
            </p>
            {offer.note ? <p className="text-caption text-muted-foreground mt-2">{offer.note}</p> : null}
            <OfferRevisionMeta revisionNumber={offer.revisionNumber} expiresAt={offer.expiresAt} />
            <p className="text-caption text-muted-foreground mt-1">{formatDateTr(offer.createdAt)}</p>
          </div>
          <OfferStatusBadge status={offer.status} />
        </div>
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <OfferRevisionActions pending={false} onHistory={onHistory} />
          <MessageUserButton
            otherUserId={offer.slaughterhouseId}
            contextLabel={[offer.listingType, offer.listingCategory].filter(Boolean).join(' · ')}
          />
          {offer.status === 'PENDING' ? (
            <RespondToOfferButtons acting={acting} onAccept={onAccept} onReject={onReject} className="flex-1 min-w-[12rem]" />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function OutgoingOfferCard({
  offer,
  onRevise,
  onHistory,
}: {
  offer: SellerAnimalOfferItemDto
  onRevise: () => void
  onHistory: () => void
}) {
  return (
    <Card>
      <CardContent className="p-5 flex justify-between gap-4">
        <div>
          <h3 className="font-medium">{offer.request.title}</h3>
          <p className="text-small text-muted-foreground">
            {offer.request.slaughterhouseName || 'Kesimhane'} · {formatTry(offer.pricePerKg)} / kg
          </p>
          <OfferRevisionMeta revisionNumber={offer.revisionNumber} expiresAt={offer.expiresAt} />
          <p className="text-caption text-muted-foreground mt-1">{formatDateTr(offer.createdAt)}</p>
        </div>
        <OfferStatusBadge status={offer.status} />
      </CardContent>
      <div className="px-5 pb-5 flex flex-wrap gap-2">
        <OfferRevisionActions
          pending={offer.status === 'PENDING'}
          onRevise={onRevise}
          onHistory={onHistory}
        />
        <MessageUserButton
          otherUserId={offer.request.slaughterhouseId}
          contextLabel={offer.request.title}
        />
      </div>
    </Card>
  )
}
