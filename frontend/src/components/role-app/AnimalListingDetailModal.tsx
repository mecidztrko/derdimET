import { useEffect, useState } from 'react'
import { X, MapPin } from 'lucide-react'
import { getAnimalListing } from '../../api/listings'
import { ApiError } from '../../api/client'
import type { SellerAnimalListingDto } from '../../api/types'
import { animalCategoryLabel } from '../../api/mappers'
import { formatDateTr, formatHeadCount, formatKg, formatTry, resolveMediaUrl } from '../../api/format'
import { Button } from './Button'
import { Badge } from './Badge'
import { Card, CardContent } from './Card'
import { MessageUserButton } from './MessageUserButton'

type AnimalListingDetailModalProps = {
  listingId: number | null
  open: boolean
  onClose: () => void
  /** Kesimhane: teklif ver */
  onOffer?: (item: SellerAnimalListingDto) => void
  readOnly?: boolean
}

export function AnimalListingDetailModal({
  listingId,
  open,
  onClose,
  onOffer,
  readOnly = false,
}: AnimalListingDetailModalProps) {
  const [item, setItem] = useState<SellerAnimalListingDto | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || listingId == null) {
      setItem(null)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    getAnimalListing(listingId)
      .then(setItem)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'İlan yüklenemedi'))
      .finally(() => setLoading(false))
  }, [open, listingId])

  if (!open) return null

  const images = item?.imageUrls?.map(resolveMediaUrl).filter(Boolean) ?? []
  const isOpen = item?.status === 'OPEN'
  const title = item ? [item.type, item.breed].filter(Boolean).join(' · ') || 'Hayvan ilanı' : ''

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-h3">Hayvan ilanı</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          {loading && <p className="text-muted-foreground text-small">Yükleniyor…</p>}
          {error && <p className="text-destructive text-small">{error}</p>}

          {item && !loading && (
            <>
              {images[0] ? (
                <img src={images[0]} alt={title} className="w-full aspect-video object-cover rounded-lg mb-4" />
              ) : null}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <h3 className="font-medium text-lg">{title}</h3>
                  <p className="text-small text-muted-foreground mt-1">
                    {item.sellerCompanyName || item.sellerName || 'Satıcı'}
                  </p>
                </div>
                <Badge variant={isOpen ? 'success' : 'default'}>{isOpen ? 'Açık' : 'Kapalı'}</Badge>
              </div>

              <p className="text-small text-muted-foreground flex items-center gap-1 mb-4">
                <MapPin className="size-4" />
                {[item.sellerCity, item.location].filter(Boolean).join(', ') || 'Konum belirtilmedi'}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-4 text-small">
                <div>
                  <p className="text-caption text-muted-foreground">Kategori</p>
                  <p className="font-medium">{animalCategoryLabel(item.category)}</p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground">Miktar</p>
                  <p className="font-medium">{formatHeadCount(item.quantity)}</p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground">Fiyat / kg</p>
                  <p className="font-semibold text-primary">{formatTry(item.price)}</p>
                </div>
                <div>
                  <p className="text-caption text-muted-foreground">Ort. ağırlık</p>
                  <p className="font-medium">{formatKg(item.avgWeightKg)}</p>
                </div>
                {item.ageMonths != null ? (
                  <div>
                    <p className="text-caption text-muted-foreground">Yaş</p>
                    <p className="font-medium">{item.ageMonths} ay</p>
                  </div>
                ) : null}
              </div>

              {item.description ? (
                <p className="text-small text-muted-foreground mb-4 border-t border-border pt-4">{item.description}</p>
              ) : null}
              <p className="text-caption text-muted-foreground mb-4">{formatDateTr(item.createdAt)}</p>

              {readOnly ? (
                <p className="text-small text-muted-foreground text-center py-2 border border-dashed border-border rounded-lg">
                  Bu sayfa yalnızca pazar takibi içindir; teklif verilemez.
                </p>
              ) : null}

              <div className="flex flex-col gap-2">
                {item.sellerId != null && !readOnly ? (
                  <MessageUserButton otherUserId={item.sellerId} contextLabel={title} />
                ) : null}
                {!readOnly && isOpen && onOffer ? (
                  <Button variant="primary" className="w-full" type="button" onClick={() => onOffer(item)}>
                    Teklif ver
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
