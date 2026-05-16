import { apiFetch } from './client'

export function toggleFavoriteUser(userId: number): Promise<{ isFavoritedByMe: boolean }> {
  return apiFetch(`/api/favorites/toggle/${userId}`, { method: 'POST' })
}
