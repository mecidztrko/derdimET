import { useState, type FormEvent } from 'react'
import { createAnimalPurchaseRequest } from '../../api/animalMarket'
import type { AnimalCategory } from '../../lib/animalCategory'
import { ANIMAL_CATEGORY_LABELS } from '../../lib/animalCategory'
import { Card } from '../dashboard/Card'

export function AdminAnimalPurchaseForm() {
  const [title, setTitle] = useState('')
  const [animalCategory, setAnimalCategory] = useState<AnimalCategory | null>(null)
  const [quantity, setQuantity] = useState('')
  const [expectedWeight, setExpectedWeight] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const t = title.trim()
    if (!t) {
      setError('Başlık zorunlu')
      return
    }
    if (!animalCategory) {
      setError('Küçükbaş veya büyükbaş seçin')
      return
    }
    setSubmitting(true)
    setError(null)
    setMessage(null)
    try {
      const q = quantity.trim() === '' ? null : parseInt(quantity, 10)
      if (q !== null && (!Number.isFinite(q) || q < 1)) {
        setError('Adet geçerli bir pozitif tam sayı olmalı')
        setSubmitting(false)
        return
      }
      let ew: number | null = null
      if (expectedWeight.trim() !== '') {
        ew = Number(String(expectedWeight).replace(',', '.'))
        if (!Number.isFinite(ew) || ew <= 0) {
          setError('Beklenen ağırlık pozitif bir sayı olmalı')
          setSubmitting(false)
          return
        }
      }
      await createAnimalPurchaseRequest({
        title: t,
        animalCategory,
        quantity: q,
        expectedWeight: ew,
        description: description.trim() || null,
      })
      setMessage('İlan oluşturuldu.')
      setTitle('')
      setAnimalCategory(null)
      setQuantity('')
      setExpectedWeight('')
      setDescription('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kayıt başarısız')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card padding="lg">
      <h3 className="font-display text-lg font-semibold text-gray-900">Hayvan alış ilanı (yönetici)</h3>
      <p className="mt-1 text-sm text-gray-500">Satıcılar bu ilanı açık talepler listesinde görür.</p>
      {error && (
        <p className="mt-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
      )}
      {message && (
        <p className="mt-3 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {message}
        </p>
      )}
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-600">Başlık *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-clinical-500"
            required
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-600">Hayvan türü *</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {(['KUCUKBAS', 'BUYUKBAS'] as const).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setAnimalCategory(key)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  animalCategory === key
                    ? 'bg-clinical-600 text-white shadow-md'
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-clinical-50'
                }`}
              >
                {ANIMAL_CATEGORY_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600">Adet</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-clinical-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600">Beklenen ağırlık (kg)</label>
          <input
            type="text"
            inputMode="decimal"
            value={expectedWeight}
            onChange={(e) => setExpectedWeight(e.target.value)}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-clinical-500"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600">Açıklama</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-clinical-500"
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-gradient-to-r from-clinical-500 to-clinical-700 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-60"
        >
          {submitting ? 'Kaydediliyor…' : 'İlanı yayınla'}
        </button>
      </form>
    </Card>
  )
}
