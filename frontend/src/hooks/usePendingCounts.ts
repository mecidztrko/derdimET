import { useMemo } from 'react'
import { useApi } from './useApi'
import * as buyerApi from '../api/buyer'
import * as sellerApi from '../api/seller'
import * as shApi from '../api/slaughterhouse'

export function useBuyerPendingCounts() {
  const offers = useApi(() => buyerApi.listMyMeatOffers(), [])
  const pendingOffers = useMemo(
    () => (offers.data ?? []).filter((o) => o.status === 'PENDING').length,
    [offers.data],
  )
  return { pendingOffers }
}

export function useSellerPendingCounts() {
  const incoming = useApi(() => sellerApi.listIncomingListingOffers(), [])
  const pendingIncoming = useMemo(
    () => (incoming.data ?? []).filter((o) => o.status === 'PENDING').length,
    [incoming.data],
  )
  return { pendingIncoming }
}

export function useSlaughterhousePendingCounts() {
  const meatOffers = useApi(() => shApi.listIncomingMeatOffers(), [])
  const pendingMeatOffers = useMemo(
    () => (meatOffers.data ?? []).filter((o) => o.status === 'PENDING').length,
    [meatOffers.data],
  )
  return { pendingMeatOffers }
}
