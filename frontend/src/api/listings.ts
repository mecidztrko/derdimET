import { apiFetch } from './client'
import type { AnimalPurchaseRequestDto, MeatSaleRequestDto, SellerAnimalListingDto } from './types'

export function getAnimalListing(id: number): Promise<SellerAnimalListingDto> {
  return apiFetch(`/api/listings/animal/${id}`)
}

export function getMeatListing(id: number): Promise<MeatSaleRequestDto> {
  return apiFetch(`/api/listings/meat/${id}`)
}

export function getAnimalPurchaseRequest(id: number): Promise<AnimalPurchaseRequestDto> {
  return apiFetch(`/api/listings/animal-request/${id}`)
}
