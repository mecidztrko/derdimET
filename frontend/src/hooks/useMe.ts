import { useCallback, useEffect, useState } from 'react'
import { apiUrl } from '../config/apiBase'
import type { MeUser } from '../types/me'

export function useMe() {
  const [user, setUser] = useState<MeUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch(apiUrl('/api/me'), { credentials: 'include' })
      .then(async (r) => {
        if (!r.ok) {
          setUser(null)
          if (r.status === 401) setError('unauthorized')
          else setError('unknown')
          return
        }
        setUser((await r.json()) as MeUser)
      })
      .catch(() => {
        setUser(null)
        setError('network')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { user, loading, error, refetch }
}
