import { Heart, MapPin, Factory } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card } from './Card'
import { Badge } from './Badge'
import { cn } from '../../lib/cn'
import { listingCardStatusLabel } from '../../api/format'

interface ListingCardProps {
  id: string
  image: string
  title: string
  seller: {
    name: string
    location: string
    verified?: boolean
  }
  price: string
  unit: string
  quantity: string
  status: 'open' | 'closed' | 'pending'
  className?: string
  onClick?: () => void
  showSlaughterhouseLabel?: boolean
  isFavorite?: boolean
  favoriteUserId?: number | null
  onFavoriteToggle?: (userId: number, next: boolean) => void | Promise<void>
  /** Doğrulanmamış hesapta favoriye ekleme engellenir; çıkarma serbest. */
  favoriteAddBlocked?: boolean
}

export function ListingCard({
  image,
  title,
  seller,
  price,
  unit,
  quantity,
  status,
  className,
  onClick,
  showSlaughterhouseLabel = false,
  isFavorite: initialFavorite = false,
  favoriteUserId,
  onFavoriteToggle,
  favoriteAddBlocked = false,
}: ListingCardProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite)

  useEffect(() => {
    setIsFavorite(initialFavorite)
  }, [initialFavorite])

  async function handleFavorite(e: React.MouseEvent) {
    e.stopPropagation()
    if (!isFavorite && favoriteAddBlocked) return
    if (favoriteUserId != null && onFavoriteToggle) {
      const next = !isFavorite
      setIsFavorite(next)
      try {
        await onFavoriteToggle(favoriteUserId, next)
      } catch {
        setIsFavorite(!next)
      }
      return
    }
    setIsFavorite(!isFavorite)
  }

  return (
    <Card
      elevation="hover"
      padding="none"
      className={cn('overflow-hidden cursor-pointer group', className)}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="size-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          type="button"
          title={!isFavorite && favoriteAddBlocked ? 'E-posta doğrulaması gerekli' : undefined}
          disabled={!isFavorite && favoriteAddBlocked}
          className={cn(
            'absolute top-3 right-3 size-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed',
            isFavorite && 'text-destructive',
          )}
          onClick={(e) => void handleFavorite(e)}
        >
          <Heart className={cn('size-5', isFavorite && 'fill-current')} />
        </button>
        <div className="absolute top-3 left-3">
          <Badge variant={status}>{listingCardStatusLabel(status)}</Badge>
        </div>
      </div>

      <div className="p-5">
        <h4 className="mb-2 line-clamp-1">{title}</h4>

        <div className="flex items-center gap-2 mb-3">
          <div className="size-7 rounded-full bg-primary-soft flex items-center justify-center">
            {showSlaughterhouseLabel ? (
              <Factory className="size-4 text-primary" />
            ) : (
              <span className="text-caption font-medium text-primary">
                {seller.name.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-small font-medium truncate">
              {seller.name}
              {seller.verified && (
                <span className="ml-1 text-secondary font-bold">✓</span>
              )}
            </p>
            {showSlaughterhouseLabel && (
              <p className="text-caption text-muted-foreground">Kesimhane</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-muted-foreground mb-4">
          <MapPin className="size-4" />
          <span className="text-small">{seller.location}</span>
        </div>

        <div className="flex items-end justify-between pt-3 border-t border-border">
          <div>
            <p className="text-caption text-muted-foreground">Fiyat</p>
            <p className="font-mono font-medium text-foreground">
              {price}
              <span className="text-small text-muted-foreground"> / {unit}</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-caption text-muted-foreground">Miktar</p>
            <p className="text-small font-medium">{quantity}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
