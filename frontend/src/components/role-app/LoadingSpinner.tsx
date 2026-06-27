type LoadingSpinnerProps = {
  size?: 'sm' | 'md'
  className?: string
}

const sizeClass = { sm: 'size-5 border', md: 'size-8 border-2' } as const

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`rounded-full border-primary border-t-transparent animate-spin ${sizeClass[size]} ${className}`}
      role="status"
      aria-label="Yükleniyor"
    />
  )
}
