import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { ApiError } from '../../api/client'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { Input } from './Input'

type OfferReviseModalProps = {
  open: boolean
  title: string
  quantityLabel: string
  initialPrice?: number | string | null
  initialQuantity?: number | string | null
  initialNote?: string | null
  onClose: () => void
  onSubmit: (body: { pricePerKg: number; quantity?: number; note?: string }) => Promise<void>
}

export function OfferReviseModal({
  open,
  title,
  quantityLabel,
  initialPrice,
  initialQuantity,
  initialNote,
  onClose,
  onSubmit,
}: OfferReviseModalProps) {
  const [pricePerKg, setPricePerKg] = useState('')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setPricePerKg(initialPrice != null ? String(initialPrice) : '')
    setQuantity(initialQuantity != null ? String(initialQuantity) : '')
    setNote(initialNote ?? '')
    setError(null)
  }, [open, initialPrice, initialQuantity, initialNote])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pricePerKg || !quantity) {
      setError('Fiyat ve miktar zorunludur.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        pricePerKg: Number(pricePerKg),
        quantity: Number(quantity),
        note: note.trim() || undefined,
      })
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Revize edilemedi')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h4">Teklifi revize et</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
          <p className="text-small text-muted-foreground mb-4">{title}</p>
          <p className="text-caption text-muted-foreground mb-4">
            Revize sonrası teklif süresi 48 saat yenilenir.
          </p>
          {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <Input
              label="Kg fiyatı (₺)"
              type="number"
              min={0}
              step="0.01"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              required
            />
            <Input
              label={quantityLabel}
              type="number"
              min={1}
              step="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
            <Input
              label="Not (opsiyonel)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex gap-2 pt-2">
              <Button variant="secondary" type="button" className="flex-1" onClick={onClose} disabled={saving}>
                Vazgeç
              </Button>
              <Button variant="primary" type="submit" className="flex-1" disabled={saving}>
                {saving ? 'Kaydediliyor…' : 'Revize et'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
