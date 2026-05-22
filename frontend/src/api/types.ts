export type RequestStatus = 'OPEN' | 'CLOSED'
export type OfferStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED'
export type AnimalCategory = 'KUCUKBAS' | 'BUYUKBAS'

export type MeatSaleRequestDto = {
  id: number
  slaughterhouseId: number | null
  slaughterhouseName: string | null
  slaughterhouseCompanyName: string | null
  slaughterhouseCity: string | null
  title: string
  meatType: string
  animalCategory: AnimalCategory | null
  cut: string | null
  quantity: number | string | null
  pricePerKg: number | string | null
  packaging: string | null
  location: string | null
  description: string | null
  imageUrls: string[] | null
  status: RequestStatus
  createdAt: string
  isFavoritedByMe: boolean | null
}

export type MeatOfferItemDto = {
  offerId: number
  saleRequestId: number | null
  title: string | null
  meatType: string | null
  requestedQuantity: number | string | null
  slaughterhouseId: number | null
  slaughterhouseName: string | null
  pricePerKg: number | string | null
  quantity: number | string | null
  note: string | null
  status: OfferStatus
  createdAt: string
}

export type SellerAnimalListingDto = {
  id: number
  sellerId: number | null
  sellerName: string | null
  sellerCompanyName: string | null
  sellerCity: string | null
  category: AnimalCategory | null
  type: string
  breed: string | null
  ageMonths: number | null
  quantity: number | null
  avgWeightKg: number | string | null
  price: number | string | null
  location: string | null
  description: string | null
  imageUrls: string[] | null
  status: RequestStatus
  createdAt: string
  isFavoritedByMe: boolean | null
  hasOfferFromMe?: boolean | null
}

export type AnimalPurchaseRequestDto = {
  id: number
  slaughterhouseId: number | null
  slaughterhouseName: string | null
  slaughterhouseCompanyName: string | null
  slaughterhouseCity: string | null
  title: string
  animalCategory: AnimalCategory | null
  quantity: number | null
  expectedWeight: number | string | null
  description: string | null
  status: RequestStatus
  createdAt: string
  isFavoritedByMe: boolean | null
  offerCount?: number | null
  pendingOfferCount?: number | null
}

export type PurchaseRequestIncomingOfferDto = {
  offerId: number
  requestId: number | null
  sellerId: number | null
  sellerName: string | null
  sellerCompanyName: string | null
  pricePerKg: number | string
  animalCount: number | null
  note: string | null
  status: OfferStatus
  createdAt: string
}

export type SellerAnimalOfferItemDto = {
  offerId: number
  request: AnimalPurchaseRequestDto
  pricePerKg: number | string
  animalCount: number | null
  note: string | null
  status: OfferStatus
  createdAt: string
}

export type ListingOfferDto = {
  offerId: number
  listingId: number | null
  listingType: string | null
  listingCategory: string | null
  sellerId: number | null
  sellerName: string | null
  slaughterhouseId: number | null
  slaughterhouseName: string | null
  pricePerKg: number | string | null
  quantity: number | null
  note: string | null
  status: OfferStatus
  createdAt: string
}

export type BuyerPurchaseDto = {
  orderId: number
  meatOfferId: number | null
  saleRequestId: number | null
  saleTitle: string | null
  meatType: string | null
  slaughterhouseId: number | null
  slaughterhouseName: string | null
  slaughterhouseCompanyName: string | null
  pricePerKg: number | string | null
  quantity: number | string | null
  totalPrice: number | string | null
  status: string
  createdAt: string
}

export type SellerSaleDto = {
  offerId: number
  saleType: 'PURCHASE_REQUEST' | 'DIRECT_LISTING' | string
  requestId: number | null
  requestTitle: string | null
  listingId: number | null
  listingTitle: string | null
  slaughterhouseId: number | null
  slaughterhouseName: string | null
  slaughterhouseCompanyName: string | null
  pricePerKg: number | string
  animalCount: number | null
  estimatedTotal: number | string | null
  status: OfferStatus
  createdAt: string
}

export type SlaughterhousePurchaseDto = {
  offerId: number
  purchaseType: 'PURCHASE_REQUEST' | 'DIRECT_LISTING' | string
  requestId: number | null
  requestTitle: string | null
  listingId: number | null
  listingTitle: string | null
  sellerId: number | null
  sellerName: string | null
  sellerCompanyName: string | null
  pricePerKg: number | string
  animalCount: number | null
  estimatedTotal: number | string | null
  status: OfferStatus
  createdAt: string
}

export type SlaughterhouseSaleOrderDto = {
  orderId: number
  buyerId: number | null
  buyerName: string | null
  meatOfferId: number | null
  saleRequestId: number | null
  saleTitle: string | null
  meatType: string | null
  totalPrice: number | string | null
  status: string | null
  createdAt: string
}

export type FavoriteSlaughterhouseDto = {
  slaughterhouseId: number | null
  slaughterhouseName: string | null
  slaughterhouseCompanyName: string | null
  slaughterhouseCity: string | null
  slaughterhouseEmail: string | null
  createdAt: string
}

export type ConversationItemDto = {
  conversationId: number
  otherUserId: number | null
  otherUserName: string | null
  otherUserEmail: string | null
  otherUserRole: string | null
  lastMessageAt: string | null
}

export type ChatMessageDto = {
  id: number
  senderId: number | null
  senderName: string | null
  text: string
  createdAt: string
  readAt: string | null
}

export type UpdateProfileBody = {
  name?: string
  phone?: string | null
  companyName?: string | null
  taxNumber?: string | null
  addressLine?: string | null
  city?: string | null
  contactSecondaryName?: string | null
  contactSecondaryPhone?: string | null
  profileImageUrl?: string | null
}
