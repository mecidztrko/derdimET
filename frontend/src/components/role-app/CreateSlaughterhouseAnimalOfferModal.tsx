import { useState } from 'react'
import { X } from 'lucide-react'
import { ApiError } from '../../api/client'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { EmailVerificationNotice } from './EmailVerificationNotice'
import { Input } from './Input'
import { createAnimalListingOffer } from '../../api/slaughterhouse'

type CreateSlaughterhouseAnimalOfferModalProps = {
  open: boolean
  listingId: number | null
  listingTitle: string
  onClose: () => void
  onCreated: () => void
}

export function CreateSlaughterhouseAnimalOfferModal({
  open,
  listingId,
  listingTitle,
  onClose,
  onCreated,
}: CreateSlaughterhouseAnimalOfferModalProps) {
  const [pricePerKg, setPricePerKg] = useState('')
  const [quantity, setQuantity] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { blocked } = useEmailVerificationGate()

  if (!open || listingId == null) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pricePerKg) {
      setError('Kg fiyatı zorunludur.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await createAnimalListingOffer(listingId!, {
        pricePerKg: Number(pricePerKg),
        quantity: quantity ? Number(quantity) : undefined,
        note: note.trim() || undefined,
      })
      setPricePerKg('')
      setQuantity('')
      setNote('')
      onCreated()
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Teklif gönderilemedi')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h4">Hayvan teklifi</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
          <p className="text-small text-muted-foreground mb-4">{listingTitle}</p>
          {blocked ? <EmailVerificationNotice className="mb-4" /> : null}
          {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label className="text-small font-medium mb-2 block">Fiyat / kg (₺)</label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={pricePerKg}
                onChange={(e) => setPricePerKg(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-small font-medium mb-2 block">Baş sayısı (isteğe bağlı)</label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <label className="text-small font-medium mb-2 block">Not</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-card text-small resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={saving || blocked}>
                {saving ? 'Gönderiliyor…' : 'Teklif gönder'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
