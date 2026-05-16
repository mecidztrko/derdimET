import { Button } from './Button'

type PageStateProps = {
  loading?: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  onRetry?: () => void
  children: React.ReactNode
}

export function PageState({
  loading,
  error,
  empty,
  emptyMessage = 'Kayıt bulunamadı.',
  onRetry,
  children,
}: PageStateProps) {
  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center py-12 text-sm text-[var(--muted-foreground)]">
        Yükleniyor…
      </div>
    )
  }
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm text-red-800">{error}</p>
        {onRetry && (
          <Button variant="secondary" className="mt-4" onClick={onRetry}>
            Tekrar dene
          </Button>
        )}
      </div>
    )
  }
  if (empty) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-10 text-center text-sm text-[var(--muted-foreground)]">
        {emptyMessage}
      </div>
    )
  }
  return <>{children}</>
}
