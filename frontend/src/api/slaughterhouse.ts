import { apiFetch, apiFetchVoid } from './client'
import { withSearchQuery } from '../lib/searchQueryParams'
import type {
  AnimalCategory,
  AnimalPurchaseRequestDto,
  ListingOfferDto,
  MeatSaleRequestDto,
  PurchaseRequestIncomingOfferDto,
  SellerAnimalListingDto,
} from './types'

export function listAnimalListings(params?: { q?: string }): Promise<SellerAnimalListingDto[]> {
  return apiFetch(withSearchQuery('/api/slaughterhouse/animal-listings', params?.q))
}

export function listAnimalOffers(): Promise<ListingOfferDto[]> {
  return apiFetch('/api/slaughterhouse/offers')
}

export function createAnimalListingOffer(
  listingId: number,
  body: { pricePerKg: number; quantity?: number; note?: string },
): Promise<unknown> {
  return apiFetch(`/api/slaughterhouse/animal-listings/${listingId}/offers`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function listMyMeatSaleRequests(params?: { q?: string }): Promise<MeatSaleRequestDto[]> {
  return apiFetch(withSearchQuery('/api/slaughterhouse/meat-sale-requests', params?.q))
}

export function closeMeatSaleRequest(saleRequestId: number): Promise<MeatSaleRequestDto> {
  return apiFetch(`/api/slaughterhouse/meat-sale-requests/${saleRequestId}/close`, { method: 'POST' })
}

export function reopenMeatSaleRequest(saleRequestId: number): Promise<MeatSaleRequestDto> {
  return apiFetch(`/api/slaughterhouse/meat-sale-requests/${saleRequestId}/reopen`, { method: 'POST' })
}

export function updateMeatSaleRequest(
  saleRequestId: number,
  body: Partial<{
    title: string
    meatType: string
    animalCategory?: AnimalCategory
    cut?: string
    quantity: number
    pricePerKg: number
    packaging?: string
    location?: string
    description?: string
    imageUrls?: string[]
  }>,
): Promise<MeatSaleRequestDto> {
  return apiFetch(`/api/slaughterhouse/meat-sale-requests/${saleRequestId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function createMeatSaleRequest(body: {
  title: string
  meatType: string
  animalCategory?: AnimalCategory
  cut?: string
  quantity: number
  pricePerKg: number
  packaging?: string
  location?: string
  description?: string
  imageUrls?: string[]
}): Promise<MeatSaleRequestDto> {
  return apiFetch('/api/slaughterhouse/meat-sale-requests', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function listMyAnimalPurchaseRequests(params?: { q?: string }): Promise<AnimalPurchaseRequestDto[]> {
  return apiFetch(withSearchQuery('/api/slaughterhouse/animal-purchase-requests', params?.q))
}

export function closeAnimalPurchaseRequest(requestId: number): Promise<AnimalPurchaseRequestDto> {
  return apiFetch(`/api/slaughterhouse/animal-purchase-requests/${requestId}/close`, { method: 'POST' })
}

export function reopenAnimalPurchaseRequest(requestId: number): Promise<AnimalPurchaseRequestDto> {
  return apiFetch(`/api/slaughterhouse/animal-purchase-requests/${requestId}/reopen`, { method: 'POST' })
}

export function listPurchaseRequestOffers(
  requestId: number,
): Promise<PurchaseRequestIncomingOfferDto[]> {
  return apiFetch(`/api/slaughterhouse/animal-purchase-requests/${requestId}/offers`)
}

export function acceptPurchaseRequestOffer(
  offerId: number,
): Promise<PurchaseRequestIncomingOfferDto> {
  return apiFetch(`/api/slaughterhouse/animal-purchase-offers/${offerId}/accept`, { method: 'POST' })
}

export function rejectPurchaseRequestOffer(
  offerId: number,
): Promise<PurchaseRequestIncomingOfferDto> {
  return apiFetch(`/api/slaughterhouse/animal-purchase-offers/${offerId}/reject`, { method: 'POST' })
}

export type SlaughterhouseMeatOfferDto = {
  offerId: number
  saleRequestId: number | null
  saleRequestTitle: string | null
  buyerId: number | null
  buyerName: string | null
  pricePerKg: number | string | null
  quantity: number | string | null
  note: string | null
  status: string
  createdAt: string
}

export function listIncomingMeatOffers(): Promise<SlaughterhouseMeatOfferDto[]> {
  return apiFetch('/api/slaughterhouse/meat-offers')
}

export function acceptMeatOffer(offerId: number): Promise<SlaughterhouseMeatOfferDto> {
  return apiFetch(`/api/slaughterhouse/meat-offers/${offerId}/accept`, { method: 'POST' })
}

export function rejectMeatOffer(offerId: number): Promise<SlaughterhouseMeatOfferDto> {
  return apiFetch(`/api/slaughterhouse/meat-offers/${offerId}/reject`, { method: 'POST' })
}

export function updateAnimalPurchaseRequest(
  requestId: number,
  body: Partial<{
    title: string
    animalCategory: AnimalCategory
    quantity: number
    expectedWeight: number
    description: string
  }>,
): Promise<AnimalPurchaseRequestDto> {
  return apiFetch(`/api/slaughterhouse/animal-purchase-requests/${requestId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export type FavoriteSellerDto = {
  sellerId: number | null
  sellerName: string | null
  sellerEmail: string | null
  createdAt: string
}

export function listFavoriteSellers(): Promise<FavoriteSellerDto[]> {
  return apiFetch('/api/slaughterhouse/profile/favorites/sellers')
}

export function listFavoriteAnimalListings(): Promise<SellerAnimalListingDto[]> {
  return apiFetch('/api/slaughterhouse/favorite-animal-listings')
}

export function toggleAnimalListingFavorite(
  listingId: number,
): Promise<{ isFavoritedByMe: boolean }> {
  return apiFetch(`/api/slaughterhouse/animal-listings/${listingId}/favorite/toggle`, {
    method: 'POST',
  })
}

export type FavoriteBuyerDto = {
  buyerId: number | null
  buyerName: string | null
  buyerEmail: string | null
  createdAt: string
}

export function listFavoriteBuyers(): Promise<FavoriteBuyerDto[]> {
  return apiFetch('/api/slaughterhouse/profile/favorites/buyers')
}

export function listProfilePurchases(
  limit = 20,
): Promise<import('./types').SlaughterhousePurchaseDto[]> {
  return apiFetch(`/api/slaughterhouse/profile/purchases?limit=${limit}`)
}

export function listProfileSales(limit = 20): Promise<import('./types').SlaughterhouseSaleOrderDto[]> {
  return apiFetch(`/api/slaughterhouse/profile/sales?limit=${limit}`)
}

export function createAnimalPurchaseRequest(body: {
  title: string
  animalCategory: AnimalCategory
  quantity: number
  expectedWeight?: number
  description?: string
}): Promise<AnimalPurchaseRequestDto> {
  return apiFetch('/api/slaughterhouse/animal-purchase-requests', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
