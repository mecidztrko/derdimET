import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

/** Arama metnini URL `?q=` ile senkron tutar; yazarken debounce ile günceller. */
export function useSyncedSearchQuery(debounceMs = 350) {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const [searchQuery, setSearchQuery] = useState(urlQuery)

  useEffect(() => {
    setSearchQuery(urlQuery)
  }, [urlQuery])

  useEffect(() => {
    const trimmed = searchQuery.trim()
    if (trimmed === urlQuery) return

    const timer = window.setTimeout(() => {
      if (trimmed) setSearchParams({ q: trimmed }, { replace: true })
      else setSearchParams({}, { replace: true })
    }, debounceMs)

    return () => window.clearTimeout(timer)
  }, [searchQuery, urlQuery, debounceMs, setSearchParams])

  return [searchQuery, setSearchQuery] as const
}
