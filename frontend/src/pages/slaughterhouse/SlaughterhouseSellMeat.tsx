import { useMemo, useState } from 'react'
import { Plus, RotateCcw, XCircle, Pencil, Heart } from 'lucide-react'
import { Button } from '../../components/role-app/Button'
import { Card, CardContent } from '../../components/role-app/Card'
import { Badge } from '../../components/role-app/Badge'
import { OfferStatusBadge } from '../../components/role-app/OfferStatusBadge'
import { ListingCard } from '../../components/role-app/ListingCard'
import { PageState } from '../../components/role-app/PageState'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { CreateMeatSaleModal } from '../../components/role-app/CreateMeatSaleModal'
import { useApi } from '../../hooks/useApi'
import { useSyncedSearchQuery } from '../../hooks/useSyncedSearchQuery'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { useToggleFavorite } from '../../hooks/useToggleFavorite'
import * as shApi from '../../api/slaughterhouse'
import { EMAIL_VERIFICATION_REQUIRED } from '../../lib/emailVerification'
import { meatSaleToListingCard } from '../../api/mappers'
import { formatDateTr, formatKg, formatTry } from '../../api/format'
import { MessageUserButton } from '../../components/role-app/MessageUserButton'
import { RespondToOfferButtons } from '../../components/role-app/RespondToOfferButtons'
import { ApiError } from '../../api/client'
import type { SlaughterhouseMeatOfferDto } from '../../api/slaughterhouse'
import type { MeatSaleRequestDto } from '../../api/types'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'

export function SlaughterhouseSellMeat() {
  const [tab, setTab] = useState('listings')
  const [showCreate, setShowCreate] = useState(false)
  const [editListing, setEditListing] = useState<MeatSaleRequestDto | null>(null)
  const [actingId, setActingId] = useState<number | null>(null)
  const [closingId, setClosingId] = useState<number | null>(null)
  const [reopeningId, setReopeningId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const { blocked } = useEmailVerificationGate()
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery()

  const listingsQuery = useApi(
    () => shApi.listMyMeatSaleRequests({ q: searchQuery }),
    [searchQuery],
  )
  const offersQuery = useApi(() => shApi.listIncomingMeatOffers(), [])
  const favBuyersQuery = useApi(() => shApi.listFavoriteBuyers(), [])
  const { toggle: toggleFavorite, error: favoriteError, blocked: favoriteBlocked } = useToggleFavorite()

  const favoriteBuyerIds = useMemo(
    () => new Set((favBuyersQuery.data ?? []).map((b) => b.buyerId).filter((id) => id != null)),
    [favBuyersQuery.data],
  )

  const rawListings = listingsQuery.data ?? []
  const cards = rawListings.map(meatSaleToListingCard)
  const pendingOffers = (offersQuery.data ?? []).filter((o) => o.status === 'PENDING')

  async function handleClose(saleRequestId: number) {
    if (!window.confirm('Bu et ilanını kapatmak istediğinize emin misiniz?')) return
    setClosingId(saleRequestId)
    setActionError(null)
    try {
      await shApi.closeMeatSaleRequest(saleRequestId)
      listingsQuery.reload()
      offersQuery.reload()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'İlan kapatılamadı')
    } finally {
      setClosingId(null)
    }
  }

  async function handleOffer(offerId: number, accept: boolean) {
    setActingId(offerId)
    setActionError(null)
    try {
      if (accept) await shApi.acceptMeatOffer(offerId)
      else await shApi.rejectMeatOffer(offerId)
      offersQuery.reload()
      listingsQuery.reload()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'İşlem başarısız')
    } finally {
      setActingId(null)
    }
  }

  async function handleReopen(saleRequestId: number) {
    if (!window.confirm('Bu et ilanını yeniden açmak istediğinize emin misiniz?')) return
    setReopeningId(saleRequestId)
    setActionError(null)
    try {
      await shApi.reopenMeatSaleRequest(saleRequestId)
      listingsQuery.reload()
      offersQuery.reload()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'İlan açılamadı')
    } finally {
      setReopeningId(null)
    }
  }

  return (
    <RoleAppPage>
      <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="mb-2">Et satış</h1>
          <p className="text-muted-foreground">İlanlarınız ve alıcı teklifleri</p>
          {searchQuery.trim() ? (
            <p className="text-small text-muted-foreground mt-2">
              &ldquo;{searchQuery.trim()}&rdquo; için {cards.length} ilan
            </p>
          ) : null}
        </div>
        <Button variant="primary" type="button" onClick={() => setShowCreate(true)}>
          <Plus className="size-4 mr-2" />
          Yeni et ilanı
        </Button>
      </div>
      {actionError || favoriteError ? (
        <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {actionError || favoriteError}
        </p>
      ) : null}

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="listings">İlanlarım ({cards.length})</TabsTrigger>
          <TabsTrigger value="offers">Alıcı teklifleri ({pendingOffers.length} bekleyen)</TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          <PageState
            loading={listingsQuery.loading}
            error={listingsQuery.error}
            onRetry={listingsQuery.reload}
            empty={cards.length === 0}
            emptyMessage={
              searchQuery.trim()
                ? 'Aramanıza uygun et ilanı bulunamadı.'
                : 'Henüz et satış ilanınız yok.'
            }
            emptyAction={
              searchQuery.trim() ? (
                <Button variant="secondary" type="button" onClick={() => setSearchQuery('')}>
                  Aramayı temizle
                </Button>
              ) : (
                <Button variant="primary" type="button" onClick={() => setShowCreate(true)}>
                  İlk et ilanınızı oluşturun
                </Button>
              )
            }
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rawListings.map((item) => {
                const card = meatSaleToListingCard(item)
                const isOpen = item.status === 'OPEN'
                return (
                  <div key={item.id} className="space-y-2">
                    <ListingCard {...card} showSlaughterhouseLabel />
                    {isOpen ? (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditListing(item)}>
                          <Pencil className="size-4 mr-1" />
                          Düzenle
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          disabled={closingId === item.id || blocked}
                          title={blocked ? EMAIL_VERIFICATION_REQUIRED : undefined}
                          onClick={() => void handleClose(item.id)}
                        >
                          <XCircle className="size-4 mr-1" />
                          {closingId === item.id ? 'Kapatılıyor…' : 'Kapat'}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        disabled={reopeningId === item.id || blocked}
                        title={blocked ? EMAIL_VERIFICATION_REQUIRED : undefined}
                        onClick={() => void handleReopen(item.id)}
                      >
                        <RotateCcw className="size-4 mr-1" />
                        {reopeningId === item.id ? 'Açılıyor…' : 'Yeniden aç'}
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
          </PageState>
        </TabsContent>

        <TabsContent value="offers">
          <PageState
            loading={offersQuery.loading}
            error={offersQuery.error}
            onRetry={offersQuery.reload}
            empty={(offersQuery.data?.length ?? 0) === 0}
            emptyMessage="Henüz alıcı teklifi yok."
            emptyAction={
              <Button variant="secondary" type="button" onClick={() => setTab('listings')}>
                İlanlarıma git
              </Button>
            }
          >
            <div className="space-y-4">
              {(offersQuery.data ?? []).map((offer) => (
                <MeatOfferRow
                  key={offer.offerId}
                  offer={offer}
                  acting={actingId === offer.offerId}
                  isFavorite={offer.buyerId != null && favoriteBuyerIds.has(offer.buyerId)}
                  favoriteBlocked={favoriteBlocked}
                  onFavoriteToggle={() => {
                    if (!offer.buyerId) return
                    const was = favoriteBuyerIds.has(offer.buyerId)
                    void toggleFavorite(offer.buyerId, was).then(() => favBuyersQuery.reload())
                  }}
                  onAccept={() => void handleOffer(offer.offerId, true)}
                  onReject={() => void handleOffer(offer.offerId, false)}
                />
              ))}
            </div>
          </PageState>
        </TabsContent>
      </Tabs>

      <CreateMeatSaleModal
        open={showCreate || editListing != null}
        listing={editListing}
        onClose={() => {
          setShowCreate(false)
          setEditListing(null)
        }}
        onCreated={() => {
          listingsQuery.reload()
          offersQuery.reload()
        }}
      />
    </RoleAppPage>
  )
}

function MeatOfferRow({
  offer,
  acting,
  isFavorite,
  favoriteBlocked,
  onFavoriteToggle,
  onAccept,
  onReject,
}: {
  offer: SlaughterhouseMeatOfferDto
  acting: boolean
  isFavorite: boolean
  favoriteBlocked: boolean
  onFavoriteToggle: () => void
  onAccept: () => void
  onReject: () => void
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-medium">{offer.buyerName || 'Alıcı'}</h3>
            <p className="text-small text-muted-foreground">{offer.saleRequestTitle}</p>
            <p className="text-small mt-1">
              {formatTry(offer.pricePerKg)} / kg · {formatKg(offer.quantity)}
            </p>
            {offer.note ? <p className="text-caption text-muted-foreground mt-2">{offer.note}</p> : null}
            <p className="text-caption text-muted-foreground mt-2">{formatDateTr(offer.createdAt)}</p>
          </div>
          <OfferStatusBadge status={offer.status} />
        </div>
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <MessageUserButton
            otherUserId={offer.buyerId}
            contextLabel={[offer.saleRequestTitle, formatTry(offer.pricePerKg)].filter(Boolean).join(' · ')}
            className="w-full sm:w-auto"
          />
          {offer.buyerId != null ? (
            <Button
              variant="outline"
              type="button"
              className="w-full sm:flex-1"
              disabled={!isFavorite && favoriteBlocked}
              onClick={onFavoriteToggle}
            >
              <Heart className={`size-4 mr-2 ${isFavorite ? 'fill-current text-destructive' : ''}`} />
              {isFavorite ? 'Favoriden çıkar' : 'Alıcıyı favorile'}
            </Button>
          ) : null}
          {offer.status === 'PENDING' ? (
            <RespondToOfferButtons
              acting={acting}
              onAccept={onAccept}
              onReject={onReject}
              className="w-full sm:flex-1"
              buttonSize="default"
            />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
