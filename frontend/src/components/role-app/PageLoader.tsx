import { LoadingSpinner } from './LoadingSpinner'

type PageLoaderProps = {
  message?: string
}

export function PageLoader({ message = 'Yükleniyor…' }: PageLoaderProps) {
  return (
    <div className="role-app flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
      <LoadingSpinner />
      <p className="text-small text-muted-foreground">{message}</p>
    </div>
  )
}
