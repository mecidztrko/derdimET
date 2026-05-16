import { useEffect, useState } from 'react'
import { X, Heart, MapPin, Factory } from 'lucide-react'
import { getMeatListing } from '../../api/listings'
import { ApiError } from '../../api/client'
import { useToggleFavorite } from '../../hooks/useToggleFavorite'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { EMAIL_VERIFICATION_REQUIRED } from '../../lib/emailVerification'
import type { MeatSaleRequestDto } from '../../api/types'
import { animalCategoryLabel } from '../../api/mappers'
import { formatDateTr, formatKg, formatTry, resolveMediaUrl } from '../../api/format'
import { Button } from './Button'
import { Badge } from './Badge'
import { Card, CardContent } from './Card'
import { MessageUserButton } from './MessageUserButton'

type MeatListingDetailModalProps = {
  listingId: number | null
  open: boolean
  onClose: () => void
  onOffer?: (item: MeatSaleRequestDto) => void
}

export function MeatListingDetailModal({ listingId, open, onClose, onOffer }: MeatListingDetailModalProps) {
  const [item, setItem] = useState<MeatSaleRequestDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [favoriteError, setFavoriteError] = useState<string | null>(null)
  const { toggle: toggleFavorite } = useToggleFavorite()
  const { blocked: favoriteBlocked } = useEmailVerificationGate()

  useEffect(() => {
    if (!open || listingId == null) {
      setItem(null)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    getMeatListing(listingId)
      .then(setItem)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'İlan yüklenemedi'))
      .finally(() => setLoading(false))
  }, [open, listingId])

  if (!open) return null

  const images = item?.imageUrls?.map(resolveMediaUrl).filter(Boolean) ?? []
  const isOpen = item?.status === 'OPEN'

  async function handleFavorite() {
    if (!item?.slaughterhouseId) return
    const wasFavorited = !!item.isFavoritedByMe
    if (!wasFavorited && favoriteBlocked) {
      setFavoriteError(EMAIL_VERIFICATION_REQUIRED)
      return
    }
    setFavoriteError(null)
    const next = !wasFavorited
    setItem({ ...item, isFavoritedByMe: next })
    try {
      await toggleFavorite(item.slaughterhouseId, wasFavorited)
    } catch {
      setItem({ ...item, isFavoritedByMe: wasFavorited })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-h3">İlan detayı</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          {loading && <p className="text-muted-foreground text-small">Yükleniyor…</p>}
          {error && <p className="text-destructive text-small">{error}</p>}

          {item && !loading && (
            <>
              {images[0] ? (
                <img src={images[0]} alt={item.title} className="w-full aspect-video object-cover rounded-lg mb-4" />
              ) : null}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-medium text-lg">{item.title}</h3>
                  <p className="text-small text-muted-foreground flex items-center gap-1 mt-1">
                    <Factory className="size-4" />
                    {item.slaughterhouseCompanyName || item.slaughterhouseName || 'Kesimhane'}
                  </p>
                </div>
                <Badge variant={isOpen ? 'success' : 'default'}>{isOpen ? 'Açık' : 'Kapalı'}</Badge>
              </div>

              <p className="text-small text-muted-foreground flex items-center gap-1 mb-4">
                <MapPin className="size-4" />
                {[item.slaughterhouseCity, item.location].filter(Boolean).join(', ') || 'Konum belirtilmedi'}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4 text-small">
                <div>
                  <p className="text-caption text-muted-foreground">Et türü</p>
                  <p className="font-medium">{item.meatType}</p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground">Kategori</p>
                  <p className="font-medium">{animalCategoryLabel(item.animalCategory)}</p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground">Miktar</p>
                  <p className="font-medium">{formatKg(item.quantity)}</p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground">Fiyat / kg</p>
                  <p className="font-semibold text-primary">{formatTry(item.pricePerKg)}</p>
                </div>
              </div>

              {item.cut ? (
                <p className="text-small mb-2">
                  <span className="text-muted-foreground">Kesim: </span>
                  {item.cut}
                </p>
              ) : null}
              {item.packaging ? (
                <p className="text-small mb-2">
                  <span className="text-muted-foreground">Ambalaj: </span>
                  {item.packaging}
                </p>
              ) : null}
              {item.description ? (
                <p className="text-small text-muted-foreground mb-4 border-t border-border pt-4">{item.description}</p>
              ) : null}
              <p className="text-caption text-muted-foreground mb-4">{formatDateTr(item.createdAt)}</p>

              {favoriteError ? <p className="text-sm text-destructive mb-2">{favoriteError}</p> : null}
              <div className="space-y-2">
                {item.slaughterhouseId != null && onOffer ? (
                  <MessageUserButton
                    otherUserId={item.slaughterhouseId}
                    contextLabel={item.title ?? 'Et ilanı'}
                  />
                ) : null}
                <div className="flex gap-2">
                  {item.slaughterhouseId != null && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      type="button"
                      disabled={!item.isFavoritedByMe && favoriteBlocked}
                      title={!item.isFavoritedByMe && favoriteBlocked ? EMAIL_VERIFICATION_REQUIRED : undefined}
                      onClick={() => void handleFavorite()}
                    >
                      <Heart className={`size-4 mr-2 ${item.isFavoritedByMe ? 'fill-current text-destructive' : ''}`} />
                      {item.isFavoritedByMe ? 'Favoriden çıkar' : 'Favorile'}
                    </Button>
                  )}
                  {isOpen && onOffer && (
                    <Button variant="primary" className="flex-1" type="button" onClick={() => onOffer(item)}>
                      Teklif ver
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
