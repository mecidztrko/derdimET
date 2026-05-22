import { Heart, MapPin, Factory, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toggleFavoriteUser } from '../../api/favorites'
import { Card } from './Card'
import { Badge } from './Badge'
import { Button } from './Button'
import { cn } from '../../lib/cn'
import { listingCardStatusLabel } from '../../api/format'

interface PurchaseRequestCardProps {
  id: string
  slaughterhouse: {
    name: string
    location: string
    verified?: boolean
  }
  category: 'Küçükbaş' | 'Büyükbaş'
  count: number
  expectedWeight: string
  priceRange?: string
  description: string
  postedDate: string
  status: 'open' | 'closed'
  offerCount?: number
  favoriteUserId?: number | null
  isFavorite?: boolean
  favoriteAddBlocked?: boolean
  className?: string
  onClick?: () => void
  onOffer?: () => void
}

export function PurchaseRequestCard({
  slaughterhouse,
  category,
  count,
  expectedWeight,
  priceRange,
  description,
  postedDate,
  status,
  offerCount,
  favoriteUserId,
  isFavorite: isFavoriteProp = false,
  favoriteAddBlocked = false,
  className,
  onClick,
  onOffer,
}: PurchaseRequestCardProps) {
  const [isFavorite, setIsFavorite] = useState(isFavoriteProp)

  useEffect(() => {
    setIsFavorite(isFavoriteProp)
  }, [isFavoriteProp])

  return (
    <Card
      elevation="hover"
      padding="md"
      className={cn('cursor-pointer group relative', className)}
      onClick={onClick}
    >
      {favoriteUserId ? (
        <button
          type="button"
          className={cn(
            'absolute top-5 right-5 size-8 rounded-full bg-card-alt hover:bg-muted flex items-center justify-center transition-all',
            isFavorite && 'text-destructive',
          )}
          title={!isFavorite && favoriteAddBlocked ? 'E-posta doğrulaması gerekli' : undefined}
          disabled={!isFavorite && favoriteAddBlocked}
          onClick={(e) => {
            e.stopPropagation()
            if (!isFavorite && favoriteAddBlocked) return
            const next = !isFavorite
            setIsFavorite(next)
            void toggleFavoriteUser(favoriteUserId).catch(() => setIsFavorite(!next))
          }}
        >
          <Heart className={cn('size-4', isFavorite && 'fill-current')} />
        </button>
      ) : null}

      <div className="flex items-start gap-3 mb-4">
        <div className="size-10 rounded-full bg-primary-soft flex items-center justify-center flex-shrink-0">
          <Factory className="size-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="line-clamp-1">
              {slaughterhouse.name}
              {slaughterhouse.verified && (
                <span className="ml-1.5 text-secondary font-bold">✓</span>
              )}
            </h4>
            <Badge variant={status}>{listingCardStatusLabel(status)}</Badge>
          </div>
          <p className="text-caption text-muted-foreground">Kesimhane</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-muted-foreground mb-4">
        <MapPin className="size-4" />
        <span className="text-small">{slaughterhouse.location}</span>
      </div>

      {offerCount != null && offerCount > 0 ? (
        <p className="text-caption text-muted-foreground mb-3">{offerCount} satıcı teklifi</p>
      ) : null}

      <div className="mb-4">
        <p className="text-small text-muted-foreground mb-2">Aradığı hayvan:</p>
        <p className="line-clamp-2">{description}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-caption text-muted-foreground mb-1">Kategori</p>
          <p className="text-small font-medium">{category}</p>
        </div>
        <div>
          <p className="text-caption text-muted-foreground mb-1">Adet</p>
          <p className="text-small font-medium">{count} baş</p>
        </div>
        <div>
          <p className="text-caption text-muted-foreground mb-1">Ortalama Ağırlık</p>
          <p className="text-small font-medium">{expectedWeight}</p>
        </div>
      </div>

      {priceRange && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-caption text-muted-foreground mb-1">Bütçe Aralığı</p>
          <p className="font-mono text-small font-medium">{priceRange}</p>
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Calendar className="size-4" />
          <span className="text-caption">{postedDate}</span>
        </div>
        <Button
          variant="primary"
          size="sm"
          disabled={status !== 'open'}
          onClick={(e) => {
            e.stopPropagation()
            onOffer?.()
          }}
        >
          Teklif Ver
        </Button>
      </div>
    </Card>
  )
}
