import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import {
  acceptPurchaseRequestOffer,
  listPurchaseRequestOffers,
  rejectPurchaseRequestOffer,
} from '../../api/slaughterhouse'
import { ApiError } from '../../api/client'
import type { AnimalPurchaseRequestDto, PurchaseRequestIncomingOfferDto } from '../../api/types'
import { formatDateTr, formatHeadCount, formatTry } from '../../api/format'
import { Button } from './Button'
import { MessageUserButton } from './MessageUserButton'
import { RespondToOfferButtons } from './RespondToOfferButtons'
import { Badge } from './Badge'
import { Card, CardContent } from './Card'
import { PageState } from './PageState'

type PurchaseRequestOffersModalProps = {
  request: AnimalPurchaseRequestDto | null
  open: boolean
  onClose: () => void
  onUpdated: () => void
}

export function PurchaseRequestOffersModal({
  request,
  open,
  onClose,
  onUpdated,
}: PurchaseRequestOffersModalProps) {
  const [offers, setOffers] = useState<PurchaseRequestIncomingOfferDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [actingId, setActingId] = useState<number | null>(null)

  useEffect(() => {
    if (!open || !request) {
      setOffers([])
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    listPurchaseRequestOffers(request.id)
      .then(setOffers)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Teklifler yüklenemedi'))
      .finally(() => setLoading(false))
  }, [open, request])

  if (!open || !request) return null

  async function handleRespond(offerId: number, accept: boolean) {
    setActingId(offerId)
    try {
      if (accept) await acceptPurchaseRequestOffer(offerId)
      else await rejectPurchaseRequestOffer(offerId)
      const next = await listPurchaseRequestOffers(request!.id)
      setOffers(next)
      onUpdated()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'İşlem başarısız')
    } finally {
      setActingId(null)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h2 className="text-h4">Gelen teklifler</h2>
              <p className="text-small text-muted-foreground mt-1">{request.title}</p>
            </div>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          <PageState
            loading={loading}
            error={error}
            onRetry={() => {
              setLoading(true)
              listPurchaseRequestOffers(request.id)
                .then(setOffers)
                .catch((e) => setError(e instanceof ApiError ? e.message : 'Yüklenemedi'))
                .finally(() => setLoading(false))
            }}
            empty={offers.length === 0}
            emptyMessage="Bu talebe henüz satıcı teklifi gelmedi."
          >
            <div className="space-y-3 mt-4">
              {offers.map((o) => (
                <div key={o.offerId} className="p-4 rounded-lg border border-border">
                  <div className="flex justify-between gap-2 mb-2">
                    <p className="font-medium text-small">
                      {o.sellerCompanyName || o.sellerName || 'Satıcı'}
                    </p>
                    <Badge
                      variant={
                        o.status === 'PENDING'
                          ? 'pending'
                          : o.status === 'ACCEPTED'
                            ? 'accepted'
                            : 'rejected'
                      }
                    >
                      {o.status}
                    </Badge>
                  </div>
                  <p className="text-small">
                    {formatTry(o.pricePerKg)} / kg
                    {o.animalCount != null ? ` · ${formatHeadCount(o.animalCount)}` : ''}
                  </p>
                  {o.note ? <p className="text-caption text-muted-foreground mt-2">{o.note}</p> : null}
                  <p className="text-caption text-muted-foreground mt-1">{formatDateTr(o.createdAt)}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <MessageUserButton
                      otherUserId={o.sellerId}
                      contextLabel={request.title}
                    />
                    {o.status === 'PENDING' ? (
                      <RespondToOfferButtons
                        acting={actingId === o.offerId}
                        onAccept={() => void handleRespond(o.offerId, true)}
                        onReject={() => void handleRespond(o.offerId, false)}
                        className="flex-1 min-w-[12rem]"
                      />
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </PageState>
        </CardContent>
      </Card>
    </div>
  )
}
