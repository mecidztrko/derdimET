import { FormEvent, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

export type LayoutSearchTarget = {
  /** Rota prefix veya tam eşleşme */
  path: string
  placeholder: string
  /** true ise yalnızca tam path eşleşmesi */
  exact?: boolean
}

type LayoutSearchBarProps = {
  targets: LayoutSearchTarget[]
  /** Hiçbir target eşleşmezse kullanılır */
  fallback: LayoutSearchTarget
}

function resolveTarget(pathname: string, targets: LayoutSearchTarget[], fallback: LayoutSearchTarget) {
  const exact = targets.find((t) => t.exact && t.path === pathname)
  if (exact) return exact
  const prefix = targets
    .filter((t) => !t.exact && pathname.startsWith(t.path))
    .sort((a, b) => b.path.length - a.path.length)[0]
  return prefix ?? fallback
}

export function LayoutSearchBar({ targets, fallback }: LayoutSearchBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const active = useMemo(
    () => resolveTarget(location.pathname, targets, fallback),
    [location.pathname, targets, fallback],
  )
  const searchPath = active.path
  const placeholder = active.placeholder

  const [value, setValue] = useState('')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (location.pathname !== searchPath && !location.pathname.startsWith(`${searchPath}/`)) {
      return
    }
    const q = new URLSearchParams(location.search).get('q')
    setValue(q ?? '')
  }, [location.pathname, location.search, searchPath])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim()
      const onTarget =
        location.pathname === searchPath || location.pathname.startsWith(`${searchPath}/`)
      if (onTarget) {
        const current = new URLSearchParams(location.search).get('q') ?? ''
        if (trimmed === current) return
        navigate(trimmed ? `${searchPath}?q=${encodeURIComponent(trimmed)}` : searchPath, {
          replace: true,
        })
        return
      }
      if (trimmed) {
        navigate(`${searchPath}?q=${encodeURIComponent(trimmed)}`)
      }
    }, 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value, location.pathname, location.search, navigate, searchPath])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = value.trim()
    navigate(trimmed ? `${searchPath}?q=${encodeURIComponent(trimmed)}` : searchPath)
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 min-w-0 max-w-xl mx-2 sm:mx-4 md:mx-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-muted rounded-lg border-0 outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>
    </form>
  )
}
