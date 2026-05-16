import { apiFetch, apiFetchVoid } from './client'
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

export function listMyAnimalListings(): Promise<SellerAnimalListingDto[]> {
  return apiFetch('/api/seller/animal-listings')
}

/** Diğer satıcıların açık ilanları (kendi ilanları hariç). */
export function listMarketListings(params?: {
  category?: AnimalCategory
  sort?: 'newest' | 'priceAsc' | 'priceDesc'
}): Promise<SellerAnimalListingDto[]> {
  const q = new URLSearchParams()
  if (params?.category) q.set('category', params.category)
  if (params?.sort === 'priceAsc') q.set('sort', 'priceasc')
  if (params?.sort === 'priceDesc') q.set('sort', 'pricedesc')
  if (params?.sort === 'newest') q.set('sort', 'newest')
  const suffix = q.toString() ? `?${q}` : ''
  return apiFetch(`/api/seller/market-listings${suffix}`)
}

export function closeAnimalListing(listingId: number): Promise<SellerAnimalListingDto> {
  return apiFetch(`/api/seller/animal-listings/${listingId}/close`, { method: 'POST' })
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

export function listAnimalPurchaseRequests(): Promise<AnimalPurchaseRequestDto[]> {
  return apiFetch('/api/seller/animal-purchase-requests')
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

export function createAnimalOffer(
  requestId: number,
  body: { pricePerKg: number; animalCount?: number; note?: string },
): Promise<unknown> {
  return apiFetch(`/api/seller/animal-purchase-requests/${requestId}/offers`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}
