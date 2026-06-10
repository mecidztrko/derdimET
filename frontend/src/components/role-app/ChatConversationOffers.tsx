import { useState } from 'react'
import { HandCoins } from 'lucide-react'
import { ApiError } from '../../api/client'
import * as sellerApi from '../../api/seller'
import * as slaughterhouseApi from '../../api/slaughterhouse'
import { formatDateTr, formatHeadCount, formatKg, formatTry } from '../../api/format'
import type { ConversationOfferDto } from '../../api/types'
import { useMe } from '../../hooks/useMe'
import { isBuyer, isSeller, isSlaughterhouse } from '../../types/me'
import { OfferStatusBadge } from './OfferStatusBadge'
import { RespondToOfferButtons } from './RespondToOfferButtons'
import { cn } from '../../lib/cn'

type ChatConversationOffersProps = {
  offers: ConversationOfferDto[]
  loading?: boolean
  onUpdated: () => void
  className?: string
}

export function ChatConversationOffers({
  offers,
  loading,
  onUpdated,
  className,
}: ChatConversationOffersProps) {
  const { user } = useMe()
  const [actingId, setActingId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  if (loading) {
    return (
      <p className={cn('text-caption text-muted-foreground px-1 py-2', className)}>Teklifler yükleniyor…</p>
    )
  }

  if (offers.length === 0) {
    return null
  }

  async function handleRespond(offer: ConversationOfferDto, accept: boolean) {
    if (!user) return
    setActingId(offer.offerId)
    setActionError(null)
    try {
      if (offer.kind === 'LISTING' && isSeller(user.role)) {
        if (accept) await sellerApi.acceptListingOffer(offer.offerId)
        else await sellerApi.rejectListingOffer(offer.offerId)
      } else if (offer.kind === 'ANIMAL' && isSlaughterhouse(user.role)) {
        if (accept) await slaughterhouseApi.acceptPurchaseRequestOffer(offer.offerId)
        else await slaughterhouseApi.rejectPurchaseRequestOffer(offer.offerId)
      } else if (offer.kind === 'MEAT' && isSlaughterhouse(user.role)) {
        if (accept) await slaughterhouseApi.acceptMeatOffer(offer.offerId)
        else await slaughterhouseApi.rejectMeatOffer(offer.offerId)
      }
      onUpdated()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'İşlem başarısız')
    } finally {
      setActingId(null)
    }
  }

  function canRespond(offer: ConversationOfferDto): boolean {
    if (!user || offer.status !== 'PENDING' || !offer.incoming) return false
    if (offer.kind === 'LISTING' && isSeller(user.role)) return true
    if (offer.kind === 'ANIMAL' && isSlaughterhouse(user.role)) return true
    if (offer.kind === 'MEAT' && isSlaughterhouse(user.role)) return true
    return false
  }

  return (
    <div className={cn('space-y-2 border-b border-border bg-muted/30 px-4 py-3', className)}>
      <div className="flex items-center gap-2 text-caption font-semibold uppercase tracking-wide text-muted-foreground">
        <HandCoins className="size-4 text-primary" />
        Ortak teklifler ({offers.length})
      </div>
      {actionError ? <p className="text-caption text-destructive">{actionError}</p> : null}
      <div className="max-h-52 space-y-2 overflow-y-auto pr-1">
        {offers.map((offer) => (
          <div
            key={`${offer.kind}-${offer.offerId}`}
            className="rounded-lg border border-border/80 bg-card p-3 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-small font-medium leading-snug">{offer.title}</p>
                {offer.subtitle ? (
                  <p className="text-caption text-muted-foreground mt-0.5">{offer.subtitle}</p>
                ) : null}
              </div>
              <OfferStatusBadge status={offer.status} />
            </div>
            <p className="mt-2 text-small">
              {formatTry(offer.pricePerKg)} / kg
              {offer.animalCount != null ? ` · ${formatHeadCount(offer.animalCount)}` : ''}
              {offer.quantityKg != null ? ` · ${formatKg(offer.quantityKg)}` : ''}
            </p>
            {offer.note ? (
              <p className="mt-1 text-caption text-muted-foreground line-clamp-2">{offer.note}</p>
            ) : null}
            <p className="mt-1 text-caption text-muted-foreground">{formatDateTr(offer.createdAt)}</p>
            {canRespond(offer) ? (
              <div className="mt-3 border-t border-border pt-3">
                <RespondToOfferButtons
                  acting={actingId === offer.offerId}
                  onAccept={() => void handleRespond(offer, true)}
                  onReject={() => void handleRespond(offer, false)}
                />
              </div>
            ) : null}
            {isBuyer(user?.role ?? '') && offer.kind === 'MEAT' && !offer.incoming ? (
              <p className="mt-2 text-caption text-muted-foreground">Verdiğiniz et teklifi</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
