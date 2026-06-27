import { apiFetch, apiFetchVoid } from './client'
import { withSearchQuery } from '../lib/searchQueryParams'
import type {
  AnimalCategory,
  BuyerPurchaseDto,
  FavoriteSlaughterhouseDto,
  MeatOfferItemDto,
  MeatSaleRequestDto,
} from './types'

export type MeatSearchParams = {
  q?: string
  city?: string
  priceMin?: number
  priceMax?: number
  animalCategory?: AnimalCategory
  createdAfter?: string
}

function withMeatSearchQuery(base: string, params?: MeatSearchParams): string {
  const q = new URLSearchParams()
  if (params?.q?.trim()) q.set('q', params.q.trim())
  if (params?.city?.trim()) q.set('city', params.city.trim())
  if (params?.priceMin != null) q.set('priceMin', String(params.priceMin))
  if (params?.priceMax != null) q.set('priceMax', String(params.priceMax))
  if (params?.animalCategory) q.set('animalCategory', params.animalCategory)
  if (params?.createdAfter) q.set('createdAfter', params.createdAfter)
  const suffix = q.toString()
  return suffix ? `${base}?${suffix}` : base
}

export function listMeatSaleRequests(params?: MeatSearchParams): Promise<MeatSaleRequestDto[]> {
  return apiFetch(withMeatSearchQuery('/api/buyer/meat-sale-requests', params))
}

export function listFavoriteMeatSaleRequests(): Promise<MeatSaleRequestDto[]> {
  return apiFetch('/api/buyer/favorite-meat-sale-requests')
}

export function listMyMeatOffers(params?: { q?: string }): Promise<MeatOfferItemDto[]> {
  return apiFetch(withSearchQuery('/api/buyer/meat-offers', params?.q))
}

export function createMeatOffer(
  saleRequestId: number,
  body: { pricePerKg: number; quantity: number; note?: string },
): Promise<unknown> {
  return apiFetch(`/api/buyer/meat-sale-requests/${saleRequestId}/offers`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function listFavoriteSlaughterhouses(): Promise<FavoriteSlaughterhouseDto[]> {
  return apiFetch('/api/buyer/favorite-slaughterhouses')
}

export function toggleMeatListingFavorite(
  saleRequestId: number,
): Promise<{ isFavoritedByMe: boolean }> {
  return apiFetch(`/api/buyer/meat-sale-requests/${saleRequestId}/favorite/toggle`, {
    method: 'POST',
  })
}

export function listPurchases(limit = 20): Promise<BuyerPurchaseDto[]> {
  return apiFetch(`/api/buyer/purchases?limit=${limit}`)
}

export function reviseMeatOffer(
  offerId: number,
  body: { pricePerKg: number; quantity?: number; note?: string },
): Promise<MeatOfferItemDto> {
  return apiFetch(`/api/buyer/meat-offers/${offerId}/revise`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function confirmOrderPayment(orderId: number): Promise<BuyerPurchaseDto> {
  return apiFetch(`/api/buyer/orders/${orderId}/confirm-payment`, { method: 'POST' })
}

export function completeOrder(orderId: number): Promise<BuyerPurchaseDto> {
  return apiFetch(`/api/buyer/orders/${orderId}/complete`, { method: 'POST' })
}
