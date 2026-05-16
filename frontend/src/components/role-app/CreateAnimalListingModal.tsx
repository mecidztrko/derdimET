import { useEffect, useState } from 'react'
import { X, Beef } from 'lucide-react'
import { createAnimalListing, updateAnimalListing } from '../../api/seller'
import { ApiError } from '../../api/client'
import type { AnimalCategory, SellerAnimalListingDto } from '../../api/types'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { EmailVerificationNotice } from './EmailVerificationNotice'
import { Input } from './Input'
import { ImageUploadField } from './ImageUploadField'

type CreateAnimalListingModalProps = {
  open: boolean
  onClose: () => void
  onCreated: () => void
  /** Düzenleme modu */
  listing?: SellerAnimalListingDto | null
}

const emptyForm = {
  category: '' as '' | AnimalCategory,
  type: '',
  breed: '',
  ageMonths: '',
  quantity: '',
  avgWeightKg: '',
  price: '',
  location: '',
  description: '',
}

export function CreateAnimalListingModal({
  open,
  onClose,
  onCreated,
  listing,
}: CreateAnimalListingModalProps) {
  const [form, setForm] = useState(emptyForm)
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
        category: listing.category ?? '',
        type: listing.type ?? '',
        breed: listing.breed ?? '',
        ageMonths: listing.ageMonths != null ? String(listing.ageMonths) : '',
        quantity: listing.quantity != null ? String(listing.quantity) : '',
        avgWeightKg: listing.avgWeightKg != null ? String(listing.avgWeightKg) : '',
        price: listing.price != null ? String(listing.price) : '',
        location: listing.location ?? '',
        description: listing.description ?? '',
      })
      setImageUrls(listing.imageUrls ?? [])
    } else {
      setForm(emptyForm)
      setImageUrls([])
    }
    setError(null)
  }, [open, listing])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.category || !form.type.trim() || !form.quantity || !form.price) {
      setError('Kategori, tür, miktar ve fiyat zorunludur.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const payload = {
        category: form.category,
        type: form.type.trim(),
        breed: form.breed.trim() || undefined,
        ageMonths: form.ageMonths ? Number(form.ageMonths) : undefined,
        quantity: Number(form.quantity),
        avgWeightKg: form.avgWeightKg ? Number(form.avgWeightKg) : undefined,
        price: Number(form.price),
        location: form.location.trim() || undefined,
        description: form.description.trim() || undefined,
        imageUrls: imageUrls.length > 0 ? imageUrls : undefined,
      }
      if (isEdit && listing) {
        await updateAnimalListing(listing.id, payload)
      } else {
        await createAnimalListing(payload)
      }
      setForm(emptyForm)
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
            <h2>{isEdit ? 'İlanı düzenle' : 'Yeni hayvan ilanı'}</h2>
            <Button variant="ghost" size="icon" type="button" onClick={onClose}>
              <X className="size-5" />
            </Button>
          </div>
          {createBlocked ? <EmailVerificationNotice className="mb-4" /> : null}
          {error ? (
            <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-small font-medium mb-2 block">Kategori</label>
                <select
                  className="w-full h-10 px-3 border border-border rounded-lg bg-card"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value as AnimalCategory | '' })
                  }
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="KUCUKBAS">Küçükbaş</option>
                  <option value="BUYUKBAS">Büyükbaş</option>
                </select>
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Tür / ırk</label>
                <Input
                  placeholder="Örn: Kıvırcık kuzu"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Irk (isteğe bağlı)</label>
                <Input
                  value={form.breed}
                  onChange={(e) => setForm({ ...form, breed: e.target.value })}
                />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Miktar (baş)</label>
                <Input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  icon={Beef}
                  required
                />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Ortalama ağırlık (kg)</label>
                <Input
                  type="number"
                  min={0}
                  value={form.avgWeightKg}
                  onChange={(e) => setForm({ ...form, avgWeightKg: e.target.value })}
                />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Yaş (ay)</label>
                <Input
                  type="number"
                  min={0}
                  value={form.ageMonths}
                  onChange={(e) => setForm({ ...form, ageMonths: e.target.value })}
                />
              </div>
              <div>
                <label className="text-small font-medium mb-2 block">Fiyat / kg (₺)</label>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-small font-medium mb-2 block">Konum</label>
                <Input
                  placeholder="Şehir, ilçe"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
            </div>
            <ImageUploadField urls={imageUrls} onChange={setImageUrls} />
            <div>
              <label className="text-small font-medium mb-2 block">Açıklama</label>
              <textarea
                className="w-full min-h-[100px] px-3 py-2 border border-border rounded-lg bg-card resize-none text-small"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                İptal
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={saving || createBlocked}>
                {saving ? 'Kaydediliyor…' : isEdit ? 'Kaydet' : 'İlanı yayınla'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
