import { useNotificationSummary } from './useNotificationSummary'

export function useMessageUnreadCount() {
  const { data } = useNotificationSummary()
  return data?.unreadMessages ?? 0
}
