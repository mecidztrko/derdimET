import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createAnimalOffer,
  fetchMyAnimalOffers,
  fetchOpenAnimalPurchaseRequests,
  type AnimalPurchaseRequestDto,
  type SellerAnimalOfferItemDto,
} from '../../api/animalMarket'
import { useAnimalCategoryFilter } from '../../hooks/useAnimalCategoryFilter'
import {
  labelForAnimalCategory,
  matchesAnimalCategoryFilter,
} from '../../lib/animalCategory'
import { AnimalCategoryFilterBar } from './AnimalCategoryFilterBar'
import { Card } from '../dashboard/Card'
import { EmptyState } from '../dashboard/EmptyState'

const OFFER_STATUS: Record<string, string> = {
  PENDING: 'Beklemede',
  ACCEPTED: 'Kabul',
  REJECTED: 'Red',
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('tr-TR')
  } catch {
    return iso
  }
}

export function SellerAnimalMarketPanel() {
  const { filter, setFilter } = useAnimalCategoryFilter()
  const [requests, setRequests] = useState<AnimalPurchaseRequestDto[]>([])
  const [offers, setOffers] = useState<SellerAnimalOfferItemDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [offerFor, setOfferFor] = useState<AnimalPurchaseRequestDto | null>(null)
  const [pricePerKg, setPricePerKg] = useState('')
  const [animalCount, setAnimalCount] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const [r, o] = await Promise.all([fetchOpenAnimalPurchaseRequests(), fetchMyAnimalOffers()])
      setRequests(r)
      setOffers(o)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Veri alınamadı')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const visibleRequests = useMemo(
    () => requests.filter((x) => matchesAnimalCategoryFilter(x.animalCategory, filter)),
    [requests, filter],
  )
  const visibleOffers = useMemo(
    () => offers.filter((x) => matchesAnimalCategoryFilter(x.request.animalCategory, filter)),
    [offers, filter],
  )

  async function submitOffer() {
    if (!offerFor) return
    const price = Number(String(pricePerKg).replace(',', '.'))
    if (!Number.isFinite(price) || price <= 0) {
      setError('Geçerli bir kg fiyatı girin')
      return
    }
    let count: number | undefined
    if (animalCount.trim() !== '') {
      count = parseInt(animalCount, 10)
      if (!Number.isFinite(count) || count < 1) {
        setError('Hayvan adedi en az 1 olmalı')
        return
      }
    }
    setSubmitting(true)
    setError(null)
    try {
      await createAnimalOffer(offerFor.id, {
        pricePerKg: price,
        animalCount: count ?? null,
        note: note.trim() || null,
      })
      setOfferFor(null)
      setPricePerKg('')
      setAnimalCount('')
      setNote('')
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Teklif gönderilemedi')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <Card padding="lg">
        <h3 className="font-display text-base font-semibold text-gray-900">Hayvan ilanları filtresi</h3>
        <p className="mt-1 text-sm text-gray-500">
          Aşağıdaki listelerde yalnızca seçtiğiniz türü gösterir (küçükbaş / büyükbaş).
        </p>
        <div className="mt-4">
          <AnimalCategoryFilterBar filter={filter} onChange={setFilter} />
        </div>
      </Card>

      {error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      ) : null}

      {loading ? (
        <p className="text-sm text-gray-500">Yükleniyor…</p>
      ) : (
        <>
          <Card padding="lg">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-semibold text-gray-900">Açık hayvan alış ilanları</h3>
              <button
                type="button"
                onClick={() => load()}
                className="text-sm font-semibold text-clinical-600 hover:text-clinical-700"
              >
                Yenile
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">Yönetici talepleri — teklif verebilirsiniz.</p>
            <ul className="mt-4 space-y-3">
              {visibleRequests.length === 0 ? (
                <EmptyState
                  title={requests.length === 0 ? 'Açık ilan yok' : 'Filtreye uygun ilan yok'}
                  description={
                    requests.length === 0
                      ? 'Yönetici yeni ilan eklediğinde burada listelenir.'
                      : 'Profil filtresini “Tümü” yaparak tüm ilanları görebilirsiniz.'
                  }
                />
              ) : (
                visibleRequests.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-2xl border border-gray-100 bg-gray-50/80 p-4 shadow-sm"
                  >
                    <p className="font-semibold text-gray-900">{r.title}</p>
                    <p className="mt-1 text-sm text-gray-600">Tür: {labelForAnimalCategory(r.animalCategory)}</p>
                    {r.quantity != null && <p className="text-sm text-gray-600">Adet: {r.quantity}</p>}
                    {r.expectedWeight != null && (
                      <p className="text-sm text-gray-600">Beklenen ağırlık: {r.expectedWeight} kg</p>
                    )}
                    {r.description && <p className="mt-2 text-sm text-gray-700">{r.description}</p>}
                    <p className="mt-2 text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setOfferFor(r)
                        setPricePerKg('')
                        setAnimalCount('')
                        setNote('')
                        setError(null)
                      }}
                      className="mt-3 rounded-full bg-gradient-to-r from-clinical-500 to-clinical-700 px-5 py-2 text-sm font-semibold text-white shadow-md hover:shadow-lg"
                    >
                      Teklif ver
                    </button>
                  </li>
                ))
              )}
            </ul>
          </Card>

          <Card padding="lg">
            <h3 className="font-display text-lg font-semibold text-gray-900">Verdiğim teklifler</h3>
            <ul className="mt-4 space-y-3">
              {visibleOffers.length === 0 ? (
                <EmptyState
                  title={offers.length === 0 ? 'Henüz teklif yok' : 'Filtreye uygun teklif yok'}
                  description="Verdiğiniz teklifler burada görünür."
                />
              ) : (
                visibleOffers.map((o) => (
                  <li
                    key={o.offerId}
                    className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                  >
                    <p className="font-semibold text-gray-900">{o.request.title}</p>
                    <p className="text-sm text-gray-500">{labelForAnimalCategory(o.request.animalCategory)}</p>
                    <p className="mt-1 text-sm text-gray-700">
                      {o.pricePerKg} ₺/kg
                      {o.animalCount != null ? ` · ${o.animalCount} hayvan` : ''}
                    </p>
                    <p className="text-sm text-gray-600">Durum: {OFFER_STATUS[o.status] ?? o.status}</p>
                    {o.note && <p className="mt-2 text-sm text-gray-600">{o.note}</p>}
                    <p className="mt-2 text-xs text-gray-400">{formatDate(o.createdAt)}</p>
                  </li>
                ))
              )}
            </ul>
          </Card>
        </>
      )}

      {offerFor && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => !submitting && setOfferFor(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="font-display text-lg font-semibold text-gray-900">Teklif</h4>
            <p className="mt-1 text-sm text-gray-600">{offerFor.title}</p>
            <p className="text-sm text-gray-500">Tür: {labelForAnimalCategory(offerFor.animalCategory)}</p>
            <label className="mt-4 block text-xs font-semibold text-gray-600">Kg fiyatı (₺)</label>
            <input
              type="text"
              inputMode="decimal"
              value={pricePerKg}
              onChange={(e) => setPricePerKg(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-clinical-500"
              placeholder="örn. 185.50"
            />
            <label className="mt-3 block text-xs font-semibold text-gray-600">Hayvan adedi (isteğe bağlı)</label>
            <input
              type="number"
              min={1}
              value={animalCount}
              onChange={(e) => setAnimalCount(e.target.value)}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-clinical-500"
            />
            <label className="mt-3 block text-xs font-semibold text-gray-600">Not</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-clinical-500"
            />
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setOfferFor(null)}
                className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={submitOffer}
                className="rounded-full bg-clinical-600 px-4 py-2 text-sm font-semibold text-white hover:bg-clinical-700 disabled:opacity-60"
              >
                {submitting ? 'Gönderiliyor…' : 'Gönder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
