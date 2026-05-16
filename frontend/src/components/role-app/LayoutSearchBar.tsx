import { FormEvent, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'

type LayoutSearchBarProps = {
  /** Arama sonuçlarının gösterildiği rota (ör. /buyer/search) */
  searchPath: string
  placeholder: string
}

export function LayoutSearchBar({ searchPath, placeholder }: LayoutSearchBarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [value, setValue] = useState('')

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (location.pathname !== searchPath) return
    const q = new URLSearchParams(location.search).get('q')
    setValue(q ?? '')
  }, [location.pathname, location.search, searchPath])

  useEffect(() => {
    if (location.pathname !== searchPath) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const trimmed = value.trim()
      const current = new URLSearchParams(location.search).get('q') ?? ''
      if (trimmed === current) return
      navigate(trimmed ? `${searchPath}?q=${encodeURIComponent(trimmed)}` : searchPath, {
        replace: true,
      })
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
