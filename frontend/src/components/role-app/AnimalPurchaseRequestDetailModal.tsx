import { Factory, MapPin, X } from 'lucide-react'
import type { AnimalPurchaseRequestDto } from '../../api/types'
import { animalCategoryLabel } from '../../api/mappers'
import { formatDateTr, formatHeadCount, formatKg, requestStatusLabel } from '../../api/format'
import { Button } from './Button'
import { Badge } from './Badge'
import { Card, CardContent } from './Card'

type AnimalPurchaseRequestDetailModalProps = {
  request: AnimalPurchaseRequestDto | null
  open: boolean
  onClose: () => void
  onOffer?: (request: AnimalPurchaseRequestDto) => void
}

export function AnimalPurchaseRequestDetailModal({
  request,
  open,
  onClose,
  onOffer,
}: AnimalPurchaseRequestDetailModalProps) {
  if (!open || !request) return null

  const isOpen = request.status === 'OPEN'
  const location = request.slaughterhouseCity?.trim() || 'Konum belirtilmedi'
  const company =
    request.slaughterhouseCompanyName || request.slaughterhouseName || 'Kesimhane'

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-h3">Alış talebi</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>

          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-full bg-primary-soft flex items-center justify-center flex-shrink-0">
              <Factory className="size-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{company}</p>
                  <p className="text-small text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="size-4" />
                    {location}
                  </p>
                </div>
                <Badge variant={isOpen ? 'open' : 'closed'}>{requestStatusLabel(request.status)}</Badge>
              </div>
            </div>
          </div>

          <h3 className="font-medium text-lg mb-2">{request.title}</h3>
          {request.offerCount != null && request.offerCount > 0 ? (
            <p className="text-caption text-muted-foreground mb-2">
              {request.offerCount} satıcı teklifi
              {request.pendingOfferCount != null && request.pendingOfferCount > 0
                ? ` · ${request.pendingOfferCount} beklemede`
                : ''}
            </p>
          ) : null}
          {request.description ? (
            <p className="text-small text-muted-foreground mb-4 whitespace-pre-wrap">{request.description}</p>
          ) : null}

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-border mb-4">
            <div>
              <p className="text-caption text-muted-foreground mb-1">Kategori</p>
              <p className="text-small font-medium">{animalCategoryLabel(request.animalCategory)}</p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground mb-1">Adet</p>
              <p className="text-small font-medium">{formatHeadCount(request.quantity)}</p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground mb-1">Beklenen ağırlık</p>
              <p className="text-small font-medium">{formatKg(request.expectedWeight)}</p>
            </div>
            <div>
              <p className="text-caption text-muted-foreground mb-1">Yayın tarihi</p>
              <p className="text-small font-medium">{formatDateTr(request.createdAt)}</p>
            </div>
          </div>

          {onOffer && isOpen ? (
            <Button variant="primary" className="w-full" onClick={() => onOffer(request)}>
              Teklif ver
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
