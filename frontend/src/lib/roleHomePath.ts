import {
  defaultBuyerPath,
  defaultSellerPath,
  defaultSlaughterhousePath,
  routeFeatures,
} from '../config/routeFeatures'
import { isAdmin, isBuyer, isSeller, isSlaughterhouse } from '../types/me'

function hasAnyEnabled(features: Record<string, boolean>): boolean {
  return Object.values(features).some(Boolean)
}

/** Giriş sonrası varsayılan rota. Admin çoklu panel seçer. */
export function getRoleHomePath(role: string): string {
  if (isAdmin(role)) return '/role-selector'
  if (isBuyer(role) && hasAnyEnabled(routeFeatures.buyer)) return defaultBuyerPath()
  if (isSeller(role) && hasAnyEnabled(routeFeatures.seller)) return defaultSellerPath()
  if (isSlaughterhouse(role) && hasAnyEnabled(routeFeatures.slaughterhouse)) {
    return defaultSlaughterhousePath()
  }
  return '/dashboard'
}
