import type {
  AnimalCategory,
  AnimalPurchaseRequestDto,
  MeatOfferItemDto,
  MeatSaleRequestDto,
  SellerAnimalListingDto,
} from './types'
import {
  formatDateTr,
  formatHeadCount,
  formatKg,
  formatTry,
  resolveListingLocation,
  resolveMediaUrl,
} from './format'

export function animalCategoryLabel(category: AnimalCategory | null): string {
  if (category === 'BUYUKBAS') return 'Büyükbaş'
  if (category === 'KUCUKBAS') return 'Küçükbaş'
  return '—'
}

export type ListingCardModel = {
  id: string
  image: string
  title: string
  seller: { name: string; location: string; verified?: boolean }
  price: string
  unit: string
  quantity: string
  status: 'open' | 'closed' | 'pending'
}

export function meatSaleToListingCard(item: MeatSaleRequestDto): ListingCardModel {
  const location = resolveListingLocation(item.location, item.slaughterhouseCity)
  return {
    id: String(item.id),
    image: resolveMediaUrl(item.imageUrls?.[0]),
    title: item.title,
    seller: {
      name: item.slaughterhouseCompanyName || item.slaughterhouseName || 'Kesimhane',
      location,
      verified: true,
    },
    price: formatTry(item.pricePerKg),
    unit: 'kg',
    quantity: formatKg(item.quantity),
    status: item.status === 'OPEN' ? 'open' : 'closed',
  }
}

export function sellerListingToListingCard(item: SellerAnimalListingDto): ListingCardModel {
  const location = resolveListingLocation(item.location, item.sellerCity)
  const title = [item.type, item.breed].filter(Boolean).join(' · ') || 'Hayvan ilanı'
  return {
    id: String(item.id),
    image: resolveMediaUrl(item.imageUrls?.[0]),
    title,
    seller: {
      name: item.sellerCompanyName || item.sellerName || 'Satıcı',
      location,
      verified: true,
    },
    price: formatTry(item.price),
    unit: 'kg',
    quantity: formatHeadCount(item.quantity),
    status: item.status === 'OPEN' ? 'open' : 'closed',
  }
}

export function offerBadgeVariant(
  status: string,
): 'open' | 'closed' | 'pending' | 'accepted' | 'rejected' {
  switch (status) {
    case 'PENDING':
      return 'pending'
    case 'ACCEPTED':
      return 'accepted'
    case 'REJECTED':
      return 'rejected'
    case 'OPEN':
      return 'open'
    default:
      return 'closed'
  }
}

export function meatOfferSummary(offer: MeatOfferItemDto) {
  return {
    title: offer.title || offer.meatType || 'Et ilanı',
    slaughterhouse: offer.slaughterhouseName || 'Kesimhane',
    price: formatTry(offer.pricePerKg),
    quantity: formatKg(offer.quantity),
    statusLabel: offerStatusLabel(offer.status),
    variant: offerBadgeVariant(offer.status),
    date: offer.createdAt,
  }
}

export function purchaseRequestCardProps(item: AnimalPurchaseRequestDto) {
  const location =
    [item.slaughterhouseCity].filter(Boolean).join(', ') || 'Konum belirtilmedi'
  return {
    id: String(item.id),
    slaughterhouse: {
      name: item.slaughterhouseCompanyName || item.slaughterhouseName || 'Kesimhane',
      location,
      verified: true,
    },
    category: (item.animalCategory === 'BUYUKBAS' ? 'Büyükbaş' : 'Küçükbaş') as 'Küçükbaş' | 'Büyükbaş',
    count: item.quantity ?? 0,
    expectedWeight: formatKg(item.expectedWeight),
    description: item.description || item.title,
    postedDate: formatDateTr(item.createdAt),
    status: (item.status === 'OPEN' ? 'open' : 'closed') as 'open' | 'closed',
    offerCount: item.offerCount ?? undefined,
    favoriteUserId: item.slaughterhouseId ?? null,
    isFavorite: item.isFavoritedByMe ?? false,
  }
}

function offerStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Beklemede'
    case 'ACCEPTED':
      return 'Kabul edildi'
    case 'REJECTED':
      return 'Reddedildi'
    default:
      return status
  }
}
