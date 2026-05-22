import { apiFetch, apiFetchVoid } from './client'
import { withSearchQuery } from '../lib/searchQueryParams'
import type {
  BuyerPurchaseDto,
  FavoriteSlaughterhouseDto,
  MeatOfferItemDto,
  MeatSaleRequestDto,
} from './types'

export function listMeatSaleRequests(params?: { q?: string }): Promise<MeatSaleRequestDto[]> {
  return apiFetch(withSearchQuery('/api/buyer/meat-sale-requests', params?.q))
}

export function listMyMeatOffers(): Promise<MeatOfferItemDto[]> {
  return apiFetch('/api/buyer/meat-offers')
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

export function listPurchases(limit = 20): Promise<BuyerPurchaseDto[]> {
  return apiFetch(`/api/buyer/purchases?limit=${limit}`)
}
