/**
 * Backend'de karşılığı olmayan sayfalar menüden ve rotadan gizlenir.
 * API eklendikçe ilgili anahtarı true yapın.
 */
export const routeFeatures = {
  buyer: {
    home: true,
    search: true,
    offers: true,
    purchases: true,
    favorites: true,
    messages: true,
    settings: true,
  },
  seller: {
    home: true,
    listings: true,
    offers: true,
    browse: true,
    messages: true,
    settings: true,
  },
  slaughterhouse: {
    dashboard: true,
    buyAnimals: true,
    purchaseRequests: true,
    sellMeat: true,
    offers: true,
    messages: true,
    settings: true,
  },
} as const

export type BuyerFeature = keyof typeof routeFeatures.buyer
export type SellerFeature = keyof typeof routeFeatures.seller
export type SlaughterhouseFeature = keyof typeof routeFeatures.slaughterhouse

export function isBuyerRouteEnabled(feature: BuyerFeature): boolean {
  return routeFeatures.buyer[feature]
}

export function isSellerRouteEnabled(feature: SellerFeature): boolean {
  return routeFeatures.seller[feature]
}

export function isSlaughterhouseRouteEnabled(feature: SlaughterhouseFeature): boolean {
  return routeFeatures.slaughterhouse[feature]
}

/** İlk açık (enabled) alt sayfa — devre dışı rotaya gidilirse yönlendirme için */
export function defaultBuyerPath(): string {
  if (routeFeatures.buyer.home) return '/buyer'
  if (routeFeatures.buyer.search) return '/buyer/search'
  if (routeFeatures.buyer.offers) return '/buyer/offers'
  if (routeFeatures.buyer.purchases) return '/buyer/purchases'
  if (routeFeatures.buyer.favorites) return '/buyer/favorites'
  if (routeFeatures.buyer.messages) return '/buyer/messages'
  return '/role-selector'
}

export function defaultSellerPath(): string {
  if (routeFeatures.seller.home) return '/seller'
  if (routeFeatures.seller.listings) return '/seller/listings'
  if (routeFeatures.seller.offers) return '/seller/offers'
  if (routeFeatures.seller.browse) return '/seller/browse'
  if (routeFeatures.seller.messages) return '/seller/messages'
  return '/role-selector'
}

export function defaultSlaughterhousePath(): string {
  if (routeFeatures.slaughterhouse.dashboard) return '/slaughterhouse'
  if (routeFeatures.slaughterhouse.buyAnimals) return '/slaughterhouse/buy-animals'
  if (routeFeatures.slaughterhouse.purchaseRequests) return '/slaughterhouse/purchase-requests'
  if (routeFeatures.slaughterhouse.sellMeat) return '/slaughterhouse/sell-meat'
  if (routeFeatures.slaughterhouse.offers) return '/slaughterhouse/offers'
  if (routeFeatures.slaughterhouse.messages) return '/slaughterhouse/messages'
  return '/role-selector'
}
