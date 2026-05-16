import { useCallback, useState } from 'react'
import { ApiError } from '../api/client'
import { toggleFavoriteUser } from '../api/favorites'
import { EMAIL_VERIFICATION_REQUIRED } from '../lib/emailVerification'
import { useEmailVerificationGate } from './useEmailVerificationGate'

export function useToggleFavorite() {
  const { blocked } = useEmailVerificationGate()
  const [error, setError] = useState<string | null>(null)

  const toggle = useCallback(
    async (userId: number, isCurrentlyFavorited: boolean) => {
      if (!isCurrentlyFavorited && blocked) {
        const msg = EMAIL_VERIFICATION_REQUIRED
        setError(msg)
        throw new ApiError(msg, 403)
      }
      setError(null)
      try {
        const res = await toggleFavoriteUser(userId)
        return res.isFavoritedByMe
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : 'Favori güncellenemedi'
        setError(msg)
        throw e
      }
    },
    [blocked],
  )

  return { toggle, error, clearError: () => setError(null), blocked }
}
