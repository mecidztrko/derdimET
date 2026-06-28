import { apiFetch, apiFetchVoid } from './client'
import { withSearchQuery } from '../lib/searchQueryParams'
import type {
  AnimalPurchaseRequestDto,
  ListingOfferDto,
  SellerAnimalListingDto,
  SellerAnimalOfferItemDto,
} from './types'
import type { AnimalCategory } from './types'

export type SellerFavoriteSlaughterhouseDto = {
  buyerId: number
  buyerName: string | null
  buyerEmail: string | null
  createdAt: string
}

export function listFavoriteSlaughterhouses(): Promise<SellerFavoriteSlaughterhouseDto[]> {
  return apiFetch('/api/seller/profile/favorites')
}

export function listSales(limit = 20): Promise<import('./types').SellerSaleDto[]> {
  return apiFetch(`/api/seller/profile/sales?limit=${limit}`)
}

export function listMyAnimalListings(params?: { q?: string }): Promise<SellerAnimalListingDto[]> {
  return apiFetch(withSearchQuery('/api/seller/animal-listings', params?.q))
}

export function listMarketListings(params?: {
  category?: AnimalCategory
  type?: string
  ageMin?: number
  ageMax?: number
  quantityMin?: number
  quantityMax?: number
  priceMin?: number
  priceMax?: number
  sort?: 'newest' | 'priceAsc' | 'priceDesc'
  q?: string
}): Promise<SellerAnimalListingDto[]> {
  const search = new URLSearchParams()
  if (params?.category) search.set('category', params.category)
  if (params?.type?.trim()) search.set('type', params.type.trim())
  if (params?.ageMin != null) search.set('ageMin', String(params.ageMin))
  if (params?.ageMax != null) search.set('ageMax', String(params.ageMax))
  if (params?.quantityMin != null) search.set('quantityMin', String(params.quantityMin))
  if (params?.quantityMax != null) search.set('quantityMax', String(params.quantityMax))
  if (params?.priceMin != null) search.set('priceMin', String(params.priceMin))
  if (params?.priceMax != null) search.set('priceMax', String(params.priceMax))
  if (params?.sort === 'priceAsc') search.set('sort', 'priceasc')
  if (params?.sort === 'priceDesc') search.set('sort', 'pricedesc')
  if (params?.sort === 'newest') search.set('sort', 'newest')
  const base = search.toString() ? `/api/seller/market-listings?${search}` : '/api/seller/market-listings'
  return apiFetch(withSearchQuery(base, params?.q))
}

export function closeAnimalListing(listingId: number): Promise<SellerAnimalListingDto> {
  return apiFetch(`/api/seller/animal-listings/${listingId}/close`, { method: 'POST' })
}

export function reopenAnimalListing(listingId: number): Promise<SellerAnimalListingDto> {
  return apiFetch(`/api/seller/animal-listings/${listingId}/reopen`, { method: 'POST' })
}

export function updateAnimalListing(
  listingId: number,
  body: Partial<{
    category: AnimalCategory
    type: string
    breed?: string
    ageMonths?: number
    quantity: number
    avgWeightKg?: number
    price: number
    location?: string
    description?: string
    imageUrls?: string[]
  }>,
): Promise<SellerAnimalListingDto> {
  return apiFetch(`/api/seller/animal-listings/${listingId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function createAnimalListing(body: {
  category: AnimalCategory
  type: string
  breed?: string
  ageMonths?: number
  quantity: number
  avgWeightKg?: number
  price: number
  location?: string
  description?: string
  imageUrls?: string[]
}): Promise<SellerAnimalListingDto> {
  return apiFetch('/api/seller/animal-listings', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function listAnimalPurchaseRequests(params?: {
  q?: string
  category?: AnimalCategory
  quantityMin?: number
  quantityMax?: number
  expectedWeightMin?: number
  expectedWeightMax?: number
  sort?: 'newest' | 'quantityAsc' | 'quantityDesc' | 'weightAsc' | 'weightDesc'
}): Promise<AnimalPurchaseRequestDto[]> {
  const search = new URLSearchParams()
  if (params?.category) search.set('category', params.category)
  if (params?.quantityMin != null) search.set('quantityMin', String(params.quantityMin))
  if (params?.quantityMax != null) search.set('quantityMax', String(params.quantityMax))
  if (params?.expectedWeightMin != null) search.set('expectedWeightMin', String(params.expectedWeightMin))
  if (params?.expectedWeightMax != null) search.set('expectedWeightMax', String(params.expectedWeightMax))
  if (params?.sort === 'quantityAsc') search.set('sort', 'quantityasc')
  if (params?.sort === 'quantityDesc') search.set('sort', 'quantitydesc')
  if (params?.sort === 'weightAsc') search.set('sort', 'weightasc')
  if (params?.sort === 'weightDesc') search.set('sort', 'weightdesc')
  if (params?.sort === 'newest') search.set('sort', 'newest')
  const base = search.toString() ? `/api/seller/animal-purchase-requests?${search}` : '/api/seller/animal-purchase-requests'
  return apiFetch(withSearchQuery(base, params?.q))
}

export function listMyAnimalOffers(): Promise<SellerAnimalOfferItemDto[]> {
  return apiFetch('/api/seller/animal-offers')
}

/** İlanlarıma gelen kesimhane teklifleri */
export function listIncomingListingOffers(): Promise<ListingOfferDto[]> {
  return apiFetch('/api/seller/incoming-listing-offers')
}

export function acceptListingOffer(offerId: number): Promise<ListingOfferDto> {
  return apiFetch(`/api/seller/listing-offers/${offerId}/accept`, { method: 'POST' })
}

export function rejectListingOffer(offerId: number): Promise<ListingOfferDto> {
  return apiFetch(`/api/seller/listing-offers/${offerId}/reject`, { method: 'POST' })
}

export function listIncomingListingOfferHistory(offerId: number): Promise<import('./types').OfferEventDto[]> {
  return apiFetch(`/api/seller/listing-offers/${offerId}/history`)
}

export function createAnimalOffer(
  requestId: number,
  body: { pricePerKg: number; animalCount?: number; note?: string },
): Promise<unknown> {
  return apiFetch(`/api/seller/animal-purchase-requests/${requestId}/offers`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function reviseAnimalOffer(
  offerId: number,
  body: { pricePerKg: number; quantity?: number; note?: string },
): Promise<SellerAnimalOfferItemDto> {
  return apiFetch(`/api/seller/animal-offers/${offerId}/revise`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function listAnimalOfferHistory(offerId: number): Promise<import('./types').OfferEventDto[]> {
  return apiFetch(`/api/seller/animal-offers/${offerId}/history`)
}
