/** API isteklerine `q` arama parametresi ekler. */
export function withSearchQuery(base: string, q?: string): string {
  const trimmed = q?.trim()
  if (!trimmed) return base
  const sep = base.includes('?') ? '&' : '?'
  return `${base}${sep}q=${encodeURIComponent(trimmed)}`
}
