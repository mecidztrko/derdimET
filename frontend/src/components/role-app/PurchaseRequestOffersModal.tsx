import { useEffect, useMemo, useState } from 'react'
import {
  X,
  Beef,
  Calendar,
  Clock,
  MessageSquare,
  Scale,
  TrendingUp,
  User,
  Users,
} from 'lucide-react'
import {
  acceptPurchaseRequestOffer,
  listPurchaseRequestOffers,
  rejectPurchaseRequestOffer,
} from '../../api/slaughterhouse'
import { ApiError } from '../../api/client'
import type { AnimalPurchaseRequestDto, PurchaseRequestIncomingOfferDto } from '../../api/types'
import { animalCategoryLabel } from '../../api/mappers'
import {
  formatDateTr,
  formatHeadCount,
  formatKg,
  formatRelativeTr,
  formatTry,
} from '../../api/format'
import { OfferStatusBadge } from './OfferStatusBadge'
import { Button } from './Button'
import { MessageUserButton } from './MessageUserButton'
import { RespondToOfferButtons } from './RespondToOfferButtons'
import { Card, CardContent } from './Card'
import { PageState } from './PageState'
import { cn } from '../../lib/cn'

type PurchaseRequestOffersModalProps = {
  request: AnimalPurchaseRequestDto | null
  open: boolean
  onClose: () => void
  onUpdated: () => void
}

function estimateOfferTotal(
  offer: PurchaseRequestIncomingOfferDto,
  request: AnimalPurchaseRequestDto,
): number | null {
  const price = Number(offer.pricePerKg)
  const count = offer.animalCount
  const qty = request.quantity
  const weight = Number(request.expectedWeight)
  if (!count || !qty || !weight || Number.isNaN(price)) return null
  const avgKgPerHead = weight / qty
  return price * count * avgKgPerHead
}

function OfferCard({
  offer,
  request,
  acting,
  onRespond,
}: {
  offer: PurchaseRequestIncomingOfferDto
  request: AnimalPurchaseRequestDto
  acting: boolean
  onRespond: (offerId: number, accept: boolean) => void
}) {
  const seller = offer.sellerCompanyName || offer.sellerName || 'Satıcı'
  const estimate = estimateOfferTotal(offer, request)
  const isPending = offer.status === 'PENDING'

  return (
    <Card
      elevation="soft"
      className={cn(
        'overflow-hidden transition-shadow',
        isPending && 'ring-1 ring-primary/15',
        offer.status === 'ACCEPTED' && 'ring-1 ring-success/20',
        offer.status === 'REJECTED' && 'opacity-80',
      )}
    >
      <CardContent className="p-0">
        <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-soft">
              <User className="size-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold">{seller}</p>
              <p className="text-caption text-muted-foreground">Hayvan satıcısı</p>
            </div>
          </div>
          <OfferStatusBadge status={offer.status} />
        </div>

        <div className="space-y-4 px-5 py-4">
          <div className="rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
            <p className="text-caption text-muted-foreground">Teklif fiyatı</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-primary">
              {formatTry(offer.pricePerKg)}
              <span className="ml-1 text-base font-medium text-muted-foreground">/ kg</span>
            </p>
            {estimate != null ? (
              <p className="mt-2 text-small text-muted-foreground">
                Tahmini toplam:{' '}
                <span className="font-semibold text-foreground">{formatTry(estimate)}</span>
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-card-alt/80 px-3 py-2.5">
              <p className="text-caption text-muted-foreground">Hayvan sayısı</p>
              <p className="mt-0.5 text-small font-semibold">
                {offer.animalCount != null ? formatHeadCount(offer.animalCount) : 'Belirtilmedi'}
              </p>
            </div>
            <div className="rounded-lg border border-border/60 bg-card-alt/80 px-3 py-2.5">
              <p className="text-caption text-muted-foreground">Teklif tarihi</p>
              <p className="mt-0.5 text-small font-semibold">{formatDateTr(offer.createdAt)}</p>
              <p className="text-caption text-muted-foreground">{formatRelativeTr(offer.createdAt)}</p>
            </div>
          </div>

          {offer.note ? (
            <div className="rounded-lg border border-border/60 bg-muted/40 px-4 py-3">
              <p className="mb-1 flex items-center gap-1.5 text-caption font-medium text-muted-foreground">
                <MessageSquare className="size-3.5" />
                Satıcı notu
              </p>
              <p className="text-small leading-relaxed">{offer.note}</p>
            </div>
          ) : null}

          <div className="space-y-2 border-t border-border/60 pt-4">
            {offer.sellerId != null ? (
              <MessageUserButton
                otherUserId={offer.sellerId}
                contextLabel={request.title}
                size="default"
                className="w-full"
              />
            ) : null}
            {isPending ? (
              <RespondToOfferButtons
                acting={acting}
                onAccept={() => onRespond(offer.offerId, true)}
                onReject={() => onRespond(offer.offerId, false)}
                className="w-full"
                buttonSize="default"
              />
            ) : null}
          </div>
        </div>
      </CardContent>
    </Card>
  )
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

  const stats = useMemo(() => {
    const pending = offers.filter((o) => o.status === 'PENDING').length
    const accepted = offers.filter((o) => o.status === 'ACCEPTED').length
    const rejected = offers.filter((o) => o.status === 'REJECTED').length
    return { total: offers.length, pending, accepted, rejected }
  }, [offers])

  const sortedOffers = useMemo(() => {
    const order = { PENDING: 0, ACCEPTED: 1, REJECTED: 2 }
    return [...offers].sort(
      (a, b) => (order[a.status] ?? 3) - (order[b.status] ?? 3),
    )
  }, [offers])

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <Card
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden shadow-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

        <div className="relative overflow-hidden border-b border-border/60">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-secondary/[0.05]" />
          <div className="relative flex items-start justify-between gap-4 px-6 py-5">
            <div className="min-w-0 flex-1">
              <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-caption font-semibold text-primary">
                <TrendingUp className="size-3.5" />
                Gelen teklifler
              </p>
              <h2 className="role-app-page-title text-xl sm:text-2xl">{request.title}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-caption text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/80 px-2.5 py-1">
                  <Beef className="size-3.5" />
                  {animalCategoryLabel(request.animalCategory)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/80 px-2.5 py-1">
                  <Users className="size-3.5" />
                  {formatHeadCount(request.quantity)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/80 px-2.5 py-1">
                  <Scale className="size-3.5" />
                  {formatKg(request.expectedWeight)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/80 px-2.5 py-1">
                  <Calendar className="size-3.5" />
                  {formatDateTr(request.createdAt)}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" type="button" onClick={onClose} className="shrink-0">
              <X className="size-5" />
            </Button>
          </div>
        </div>

        {!loading && offers.length > 0 ? (
          <div className="grid grid-cols-3 gap-px border-b border-border/60 bg-border/40">
            <div className="bg-card px-4 py-3 text-center">
              <p className="text-caption text-muted-foreground">Toplam</p>
              <p className="text-lg font-semibold">{stats.total}</p>
            </div>
            <div className="bg-card px-4 py-3 text-center">
              <p className="text-caption text-muted-foreground">Beklemede</p>
              <p className="text-lg font-semibold text-warning">{stats.pending}</p>
            </div>
            <div className="bg-card px-4 py-3 text-center">
              <p className="text-caption text-muted-foreground">Sonuçlanan</p>
              <p className="text-lg font-semibold">{stats.accepted + stats.rejected}</p>
            </div>
          </div>
        ) : null}

        <CardContent className="flex-1 overflow-y-auto p-6">
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
            emptyMessage="Bu talebe henüz satıcı teklifi gelmedi. Açık talepler satıcı panelinde görünür."
            emptyAction={
              <Button variant="secondary" type="button" onClick={onClose}>
                Kapat
              </Button>
            }
          >
            <div className="space-y-4">
              {sortedOffers.map((o) => (
                <OfferCard
                  key={o.offerId}
                  offer={o}
                  request={request}
                  acting={actingId === o.offerId}
                  onRespond={(id, accept) => void handleRespond(id, accept)}
                />
              ))}
            </div>
          </PageState>

          {!loading && offers.length > 0 ? (
            <p className="mt-4 flex items-center justify-center gap-1.5 text-caption text-muted-foreground">
              <Clock className="size-3.5" />
              Bekleyen teklifleri değerlendirdikten sonra talebi kapatabilirsiniz.
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
