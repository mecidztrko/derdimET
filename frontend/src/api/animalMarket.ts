import { apiUrl } from '../config/apiBase'
import type { AnimalCategory } from '../lib/animalCategory'

export type RequestStatus = 'OPEN' | 'CLOSED'
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'

export type AnimalPurchaseRequestDto = {
  id: number
  title: string
  animalCategory: AnimalCategory | null
  quantity: number | null
  expectedWeight: number | null
  description: string | null
  status: RequestStatus
  createdAt: string
}

export type SellerAnimalOfferItemDto = {
  offerId: number
  request: AnimalPurchaseRequestDto
  pricePerKg: number
  animalCount: number | null
  note: string | null
  status: OfferStatus
  createdAt: string
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text()
  if (!text) return {}
  try {
    return JSON.parse(text) as unknown
  } catch {
    return { message: text }
  }
}

function errMessage(data: unknown): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const m = (data as { message?: unknown }).message
    if (typeof m === 'string' && m.length > 0) return m
  }
  return 'İstek başarısız'
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers as Record<string, string>),
    },
    ...init,
  })
  const data = await parseJson(res)
  if (!res.ok) throw new Error(errMessage(data))
  return data as T
}

export function fetchOpenAnimalPurchaseRequests(): Promise<AnimalPurchaseRequestDto[]> {
  return apiFetch<AnimalPurchaseRequestDto[]>('/api/seller/animal-purchase-requests')
}

export function fetchMyAnimalOffers(): Promise<SellerAnimalOfferItemDto[]> {
  return apiFetch<SellerAnimalOfferItemDto[]>('/api/seller/animal-offers')
}

export function createAnimalOffer(
  requestId: number,
  body: { pricePerKg: number; animalCount?: number | null; note?: string | null },
): Promise<unknown> {
  return apiFetch(`/api/seller/animal-purchase-requests/${requestId}/offers`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

