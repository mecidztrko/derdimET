type PageLoaderProps = {
  message?: string
}

export function PageLoader({ message = 'Yükleniyor…' }: PageLoaderProps) {
  return (
    <div className="role-app min-h-screen bg-background flex flex-col items-center justify-center gap-3">
      <div
        className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin"
        aria-hidden
      />
      <p className="text-small text-muted-foreground">{message}</p>
    </div>
  )
}
