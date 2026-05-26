import { apiFetch } from './client'

export type NotificationSummaryDto = {
  pendingOffers: number
  pendingIncoming: number
  pendingPurchaseOffers: number
  unreadMessages: number
  primaryLink: string
}

export function getNotificationSummary(): Promise<NotificationSummaryDto> {
  return apiFetch('/api/notifications/summary')
}
