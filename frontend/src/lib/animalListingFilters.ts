import type { SellerAnimalListingDto } from '../api/types'

export function filterAnimalListings(
  items: SellerAnimalListingDto[],
  opts: { search?: string },
): SellerAnimalListingDto[] {
  const q = opts.search?.trim().toLowerCase()
  if (!q) return items
  return items.filter((item) => {
    const hay = [
      item.type,
      item.breed,
      item.location,
      item.sellerCity,
      item.sellerName,
      item.sellerCompanyName,
      item.description,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    return hay.includes(q)
  })
}
