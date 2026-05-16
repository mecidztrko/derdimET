import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createAnimalPurchaseRequest, updateAnimalPurchaseRequest } from '../../api/slaughterhouse'
import { ApiError } from '../../api/client'
import type { AnimalCategory, AnimalPurchaseRequestDto } from '../../api/types'
import { ANIMAL_CATEGORY_LABELS } from '../../lib/animalCategory'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { EmailVerificationNotice } from './EmailVerificationNotice'
import { Input } from './Input'
import { Chip } from './Chip'

type CreateAnimalPurchaseRequestModalProps = {
  open: boolean
  onClose: () => void
  onCreated: () => void
  request?: AnimalPurchaseRequestDto | null
}

const empty = {
  title: '',
  animalCategory: '' as '' | AnimalCategory,
  quantity: '',
  expectedWeight: '',
  description: '',
}

export function CreateAnimalPurchaseRequestModal({
  open,
  onClose,
  onCreated,
  request,
}: CreateAnimalPurchaseRequestModalProps) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEdit = request != null
  const { blocked } = useEmailVerificationGate()
  const createBlocked = blocked && !isEdit

  useEffect(() => {
    if (!open) return
    if (request) {
      setForm({
        title: request.title ?? '',
        animalCategory: request.animalCategory ?? '',
        quantity: request.quantity != null ? String(request.quantity) : '',
        expectedWeight:
          request.expectedWeight != null ? String(request.expectedWeight) : '',
        description: request.description ?? '',
      })
    } else {
      setForm(empty)
    }
    setError(null)
  }, [open, request])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const title = form.title.trim()
    if (!title) {
      setError('Başlık zorunludur.')
      return
    }
    if (!form.animalCategory) {
      setError('Hayvan kategorisi seçin.')
      return
    }
    const quantity = parseInt(form.quantity, 10)
    if (!Number.isFinite(quantity) || quantity < 1) {
      setError('Adet en az 1 olmalıdır.')
      return
    }
    let expectedWeight: number | undefined
    if (form.expectedWeight.trim() !== '') {
      expectedWeight = Number(form.expectedWeight.replace(',', '.'))
      if (!Number.isFinite(expectedWeight) || expectedWeight <= 0) {
        setError('Beklenen ağırlık pozitif bir sayı olmalıdır.')
        return
      }
    }
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title,
        animalCategory: form.animalCategory,
        quantity,
        expectedWeight,
        description: form.description.trim() || undefined,
      }
      if (isEdit && request) {
        await updateAnimalPurchaseRequest(request.id, payload)
      } else {
        await createAnimalPurchaseRequest(payload)
      }
      onCreated()
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : isEdit ? 'Talep güncellenemedi' : 'Talep oluşturulamadı')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-h4">{isEdit ? 'Talebi düzenle' : 'Hayvan alış talebi'}</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
          {!isEdit ? (
            <p className="text-small text-muted-foreground mb-4">
              Satıcılar bu talebi pazar ekranında görür ve teklif verebilir.
            </p>
          ) : null}
          {createBlocked ? <EmailVerificationNotice className="mb-4" /> : null}
          {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div>
              <label className="text-small font-medium mb-2 block">Başlık</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Örn: 50 baş kuzu alımı"
                required
              />
            </div>
            <div>
              <p className="text-small font-medium mb-2">Kategori</p>
              <div className="flex flex-wrap gap-2">
                {(['KUCUKBAS', 'BUYUKBAS'] as const).map((key) => (
                  <Chip
                    key={key}
                    selected={form.animalCategory === key}
                    onClick={() => setForm((f) => ({ ...f, animalCategory: key }))}
                  >
                    {ANIMAL_CATEGORY_LABELS[key]}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-small font-medium mb-2 block">Adet</label>
                <Input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Beklenen ağırlık (kg)</label>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={form.expectedWeight}
                  onChange={(e) => setForm((f) => ({ ...f, expectedWeight: e.target.value }))}
                  placeholder="İsteğe bağlı"
                />
              </div>
            </div>
            <div>
              <label className="text-small font-medium mb-2 block">Açıklama</label>
              <textarea
                className="w-full min-h-[96px] px-3 py-2 border border-border rounded-lg bg-card text-small resize-none"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Irk, yaş, teslimat bölgesi…"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={saving || createBlocked}>
                {saving ? 'Kaydediliyor…' : isEdit ? 'Kaydet' : 'Talebi yayınla'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
