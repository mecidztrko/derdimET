import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { createMeatSaleRequest, updateMeatSaleRequest } from '../../api/slaughterhouse'
import { ApiError } from '../../api/client'
import type { AnimalCategory, MeatSaleRequestDto } from '../../api/types'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { EmailVerificationNotice } from './EmailVerificationNotice'
import { Input } from './Input'
import { ImageUploadField } from './ImageUploadField'

type CreateMeatSaleModalProps = {
  open: boolean
  onClose: () => void
  onCreated: () => void
  listing?: MeatSaleRequestDto | null
}

const empty = {
  title: '',
  meatType: '',
  animalCategory: '' as '' | AnimalCategory,
  cut: '',
  quantity: '',
  pricePerKg: '',
  packaging: '',
  location: '',
  description: '',
}

export function CreateMeatSaleModal({ open, onClose, onCreated, listing }: CreateMeatSaleModalProps) {
  const [form, setForm] = useState(empty)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEdit = listing != null
  const { blocked } = useEmailVerificationGate()
  const createBlocked = blocked && !isEdit

  useEffect(() => {
    if (!open) return
    if (listing) {
      setForm({
        title: listing.title ?? '',
        meatType: listing.meatType ?? '',
        animalCategory: listing.animalCategory ?? '',
        cut: listing.cut ?? '',
        quantity: listing.quantity != null ? String(listing.quantity) : '',
        pricePerKg: listing.pricePerKg != null ? String(listing.pricePerKg) : '',
        packaging: listing.packaging ?? '',
        location: listing.location ?? '',
        description: listing.description ?? '',
      })
      setImageUrls(listing.imageUrls ?? [])
    } else {
      setForm(empty)
      setImageUrls([])
    }
    setError(null)
  }, [open, listing])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.meatType.trim() || !form.quantity || !form.pricePerKg) {
      setError('Başlık, et türü, miktar ve fiyat zorunludur.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload = {
        title: form.title.trim(),
        meatType: form.meatType.trim(),
        animalCategory: form.animalCategory || undefined,
        cut: form.cut.trim() || undefined,
        quantity: Number(form.quantity),
        pricePerKg: Number(form.pricePerKg),
        packaging: form.packaging.trim() || undefined,
        location: form.location.trim() || undefined,
        description: form.description.trim() || undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      }
      if (isEdit && listing) {
        await updateMeatSaleRequest(listing.id, payload)
      } else {
        await createMeatSaleRequest(payload)
      }
      setForm(empty)
      setImageUrls([])
      onCreated()
      onClose()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : isEdit ? 'İlan güncellenemedi' : 'İlan oluşturulamadı')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2>{isEdit ? 'Et ilanını düzenle' : 'Yeni et satış ilanı'}</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
          {createBlocked ? <EmailVerificationNotice className="mb-4" /> : null}
          {error ? (
            <p className="mb-4 text-sm text-destructive rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2">
              {error}
            </p>
          ) : null}
          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-small font-medium mb-2 block">Başlık</label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Örn: Dana biftek - vakumlu"
                  required
                />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Et türü</label>
                <Input
                  value={form.meatType}
                  onChange={(e) => setForm({ ...form, meatType: e.target.value })}
                  placeholder="Dana, kuzu…"
                  required
                />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Kategori</label>
                <select
                  className="w-full h-10 px-3 border border-border rounded-lg bg-card text-small"
                  value={form.animalCategory}
                  onChange={(e) =>
                    setForm({ ...form, animalCategory: e.target.value as AnimalCategory | '' })
                  }
                >
                  <option value="">Seçiniz</option>
                  <option value="KUCUKBAS">Küçükbaş</option>
                  <option value="BUYUKBAS">Büyükbaş</option>
                </select>
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Kesim / parça</label>
                <Input value={form.cut} onChange={(e) => setForm({ ...form, cut: e.target.value })} />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Miktar (kg)</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Fiyat / kg (₺)</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.pricePerKg}
                  onChange={(e) => setForm({ ...form, pricePerKg: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Paketleme</label>
                <Input
                  value={form.packaging}
                  onChange={(e) => setForm({ ...form, packaging: e.target.value })}
                />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Konum</label>
                <Input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <ImageUploadField urls={imageUrls} onChange={setImageUrls} />
                <label className="text-small font-medium mb-2 block">Açıklama</label>
                <textarea
                  className="w-full min-h-[80px] px-3 py-2 border border-border rounded-lg bg-card text-small resize-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={saving || createBlocked}>
                {saving ? 'Kaydediliyor…' : isEdit ? 'Kaydet' : 'Yayınla'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
