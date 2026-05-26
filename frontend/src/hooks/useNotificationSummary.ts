import { useMemo } from 'react'
import { useApi } from './useApi'
import { getNotificationSummary } from '../api/notifications'
import { useMe } from './useMe'
import { isBuyer, isSeller, isSlaughterhouse } from '../types/me'

export function useNotificationSummary() {
  const { user } = useMe()
  const query = useApi(() => getNotificationSummary(), [])

  const total = useMemo(() => {
    const s = query.data
    if (!s || !user) return 0
    const unread = s.unreadMessages ?? 0
    if (isBuyer(user.role)) return s.pendingOffers + unread
    if (isSeller(user.role)) return s.pendingIncoming + unread
    if (isSlaughterhouse(user.role)) {
      return s.pendingOffers + s.pendingIncoming + s.pendingPurchaseOffers + unread
    }
    return unread
  }, [query.data, user])

  const primaryLink = query.data?.primaryLink ?? '/role-selector'

  return { ...query, total, primaryLink }
}
