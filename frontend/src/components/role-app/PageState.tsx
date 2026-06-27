import { Button } from './Button'
import { LoadingSpinner } from './LoadingSpinner'

type PageStateProps = {
  loading?: boolean
  error?: string | null
  empty?: boolean
  emptyMessage?: string
  emptyTitle?: string
  emptyAction?: React.ReactNode
  onRetry?: () => void
  children: React.ReactNode
}

export function PageState({
  loading,
  error,
  empty,
  emptyMessage = 'Kayıt bulunamadı.',
  emptyTitle = 'Henüz içerik yok',
  emptyAction,
  onRetry,
  children,
}: PageStateProps) {
  if (loading) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-3 py-12">
        <LoadingSpinner />
        <p className="text-sm text-[var(--muted-foreground)]">Yükleniyor…</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-medium text-red-900">Bir sorun oluştu</p>
        <p className="mt-1 text-sm text-red-800">{error}</p>
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
      <div className="space-y-4">
        <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)] p-10 text-center">
          <p className="text-base font-medium text-[var(--foreground)]">{emptyTitle}</p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">{emptyMessage}</p>
        </div>
        {emptyAction ? <div className="text-center">{emptyAction}</div> : null}
      </div>
    )
  }
  return <>{children}</>
}
