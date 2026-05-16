import { useState } from 'react'
import { X } from 'lucide-react'
import { createAnimalOffer } from '../../api/seller'
import { ApiError } from '../../api/client'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { EmailVerificationNotice } from './EmailVerificationNotice'
import { Input } from './Input'

type CreateAnimalOfferModalProps = {
  open: boolean
  requestId: number | null
  requestTitle: string
  onClose: () => void
  onCreated: () => void
}

export function CreateAnimalOfferModal({
  open,
  requestId,
  requestTitle,
  onClose,
  onCreated,
}: CreateAnimalOfferModalProps) {
  const [pricePerKg, setPricePerKg] = useState('')
  const [animalCount, setAnimalCount] = useState('')
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { blocked } = useEmailVerificationGate()

  if (!open || requestId == null) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!pricePerKg) {
      setError('Kg fiyatı zorunludur.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await createAnimalOffer(requestId!, {
        pricePerKg: Number(pricePerKg),
        animalCount: animalCount ? Number(animalCount) : undefined,
        note: note.trim() || undefined,
      })
      setPricePerKg('')
      setAnimalCount('')
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
            <h2 className="text-h4">Teklif ver</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
          <p className="text-small text-muted-foreground mb-4">{requestTitle}</p>
          {blocked ? <EmailVerificationNotice className="mb-4" /> : null}
          {error ? (
            <p className="mb-4 text-sm text-destructive">{error}</p>
          ) : null}
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
              <label className="text-small font-medium mb-2 block">Hayvan sayısı (isteğe bağlı)</label>
              <Input
                type="number"
                min={1}
                value={animalCount}
                onChange={(e) => setAnimalCount(e.target.value)}
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
