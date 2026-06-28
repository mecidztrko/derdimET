import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { OfferEventDto } from '../../api/types'
import { formatDateTr, formatKg, formatTry } from '../../api/format'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { PageState } from './PageState'

type OfferHistoryModalProps = {
  open: boolean
  offerId: number | null
  onClose: () => void
  loadHistory: (offerId: number) => Promise<OfferEventDto[]>
}

export function OfferHistoryModal({ open, offerId, onClose, loadHistory }: OfferHistoryModalProps) {
  const [events, setEvents] = useState<OfferEventDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || offerId == null) return
    setLoading(true)
    setError(null)
    void loadHistory(offerId)
      .then(setEvents)
      .catch((e) => setError(e instanceof Error ? e.message : 'Geçmiş alınamadı'))
      .finally(() => setLoading(false))
  }, [open, offerId, loadHistory])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col">
        <CardContent className="p-6 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-h4">Teklif geçmişi</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
          <div className="overflow-y-auto min-h-0 flex-1">
            <PageState
              loading={loading}
              error={error}
              onRetry={() => {
                if (offerId == null) return
                setLoading(true)
                void loadHistory(offerId)
                  .then(setEvents)
                  .catch((e) => setError(e instanceof Error ? e.message : 'Geçmiş alınamadı'))
                  .finally(() => setLoading(false))
              }}
              empty={!loading && !error && events.length === 0}
              emptyMessage="Geçmiş kaydı yok."
            >
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="rounded-lg border border-border p-3">
                    <p className="font-medium text-small">
                      {event.eventType === 'CREATED'
                        ? 'Oluşturuldu'
                        : `Revize #${event.revisionNumber ?? '?'}`}
                    </p>
                    <p className="text-small text-muted-foreground mt-1">
                      {event.pricePerKg != null ? `${formatTry(event.pricePerKg)} / kg` : ''}
                      {event.quantity != null ? ` · Miktar: ${formatKg(event.quantity)}` : ''}
                    </p>
                    {event.note ? (
                      <p className="text-small text-muted-foreground mt-1">{event.note}</p>
                    ) : null}
                    <p className="text-caption text-muted-foreground mt-2">
                      {formatDateTr(event.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </PageState>
          </div>
          <Button variant="secondary" type="button" className="mt-4 shrink-0" onClick={onClose}>
            Kapat
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
