import { apiFetch } from './client'
import type { MeatSaleRequestDto, SellerAnimalListingDto } from './types'

export function getAnimalListing(id: number): Promise<SellerAnimalListingDto> {
  return apiFetch(`/api/listings/animal/${id}`)
}

export function getMeatListing(id: number): Promise<MeatSaleRequestDto> {
  return apiFetch(`/api/listings/meat/${id}`)
}
