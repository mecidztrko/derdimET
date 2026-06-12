import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Beef,
  Box,
  Calendar,
  Factory,
  Heart,
  MapPin,
  Package,
  Scale,
  Scissors,
  Tag,
} from 'lucide-react'
import { getMeatListing } from '../../api/listings'
import { toggleMeatListingFavorite } from '../../api/buyer'
import { ApiError } from '../../api/client'
import { animalCategoryLabel } from '../../api/mappers'
import { formatDateTr, formatKg, formatTry, resolveListingLocation, resolveMediaUrl } from '../../api/format'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { EMAIL_VERIFICATION_REQUIRED } from '../../lib/emailVerification'
import type { MeatSaleRequestDto } from '../../api/types'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { Button } from '../../components/role-app/Button'
import { Card, CardContent } from '../../components/role-app/Card'
import { PageState } from '../../components/role-app/PageState'
import { CreateMeatOfferModal } from '../../components/role-app/CreateMeatOfferModal'
import { MessageUserButton } from '../../components/role-app/MessageUserButton'
import { cn } from '../../lib/cn'

function SpecTile({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-soft backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 shrink-0" />
        <span className="text-caption font-medium">{label}</span>
      </div>
      <p className={cn('text-body font-semibold', highlight && 'text-primary')}>{value}</p>
    </div>
  )
}

export function BuyerMeatListingDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const listingId = id ? Number(id) : NaN
  const validId = Number.isFinite(listingId) && listingId > 0

  const [item, setItem] = useState<MeatSaleRequestDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favoriteError, setFavoriteError] = useState<string | null>(null)
  const [offerOpen, setOfferOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const { blocked: favoriteBlocked } = useEmailVerificationGate()

  useEffect(() => {
    if (!validId) {
      setLoading(false)
      setError('Geçersiz ilan.')
      return
    }
    setLoading(true)
    setError(null)
    getMeatListing(listingId)
      .then((data) => {
        setItem(data)
        setActiveImage(0)
      })
      .catch((e) => setError(e instanceof ApiError ? e.message : 'İlan yüklenemedi'))
      .finally(() => setLoading(false))
  }, [listingId, validId])

  const images = item?.imageUrls?.map(resolveMediaUrl).filter(Boolean) ?? []
  const isOpen = item?.status === 'OPEN'
  const slaughterhouse =
    item?.slaughterhouseCompanyName || item?.slaughterhouseName || 'Kesimhane'
  const location = resolveListingLocation(item?.location, item?.slaughterhouseCity)
  const totalEstimate =
    item?.pricePerKg != null && item?.quantity != null
      ? formatTry(item.pricePerKg * item.quantity)
      : null

  async function handleFavorite() {
    if (!item) return
    const wasFavorited = !!item.isFavoritedByMe
    if (!wasFavorited && favoriteBlocked) {
      setFavoriteError(EMAIL_VERIFICATION_REQUIRED)
      return
    }
    setFavoriteError(null)
    const next = !wasFavorited
    setItem({ ...item, isFavoritedByMe: next })
    try {
      await toggleMeatListingFavorite(item.id)
    } catch {
      setItem({ ...item, isFavoritedByMe: wasFavorited })
    }
  }

  return (
    <RoleAppPage>
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          type="button"
          className="-ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 size-4" />
          Geri
        </Button>
      </div>

      <PageState
        loading={loading}
        error={error ?? (!validId ? 'Geçersiz ilan.' : null)}
        onRetry={() => window.location.reload()}
        empty={!loading && !error && !item}
        emptyMessage="İlan bulunamadı."
        emptyAction={
          <Link to="/buyer/search">
            <Button variant="primary" type="button">
              İlanlara dön
            </Button>
          </Link>
        }
      >
        {item ? (
          <div className="space-y-8">
            {/* Görsel alanı */}
            <div className="overflow-hidden rounded-card border border-border/70 bg-card shadow-soft">
              {images.length > 0 ? (
                <div className="grid gap-0 lg:grid-cols-[1fr_120px]">
                  <div className="relative aspect-[16/9] max-h-[420px] w-full overflow-hidden bg-muted lg:max-h-none">
                    <img
                      src={images[activeImage]}
                      alt={item.title}
                      className="size-full object-cover"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                  {images.length > 1 ? (
                    <div className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:overflow-y-auto">
                      {images.map((src, i) => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => setActiveImage(i)}
                          className={cn(
                            'shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                            i === activeImage
                              ? 'border-primary ring-2 ring-primary/20'
                              : 'border-transparent opacity-70 hover:opacity-100',
                          )}
                        >
                          <img src={src} alt="" className="size-16 object-cover lg:size-full lg:aspect-square" />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="relative flex aspect-[16/9] max-h-[320px] items-center justify-center bg-gradient-to-br from-primary/[0.08] via-secondary/[0.05] to-muted">
                  <div className="pointer-events-none absolute inset-0 role-app-dot-grid opacity-30" />
                  <Package className="size-16 text-primary/30" />
                </div>
              )}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Ana içerik */}
              <div className="space-y-6 lg:col-span-2">
                <div>
                  <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1 text-caption font-semibold text-primary">
                    <Tag className="size-3.5" />
                    Et satış ilanı
                  </p>
                  <h1 className="role-app-page-title mb-3 text-2xl sm:text-3xl">{item.title}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-small text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Factory className="size-4 text-secondary" />
                      {slaughterhouse}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-4 text-secondary" />
                      {location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="size-4" />
                      {formatDateTr(item.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <SpecTile icon={Beef} label="Et türü" value={item.meatType} />
                  <SpecTile
                    icon={Package}
                    label="Kategori"
                    value={animalCategoryLabel(item.animalCategory)}
                  />
                  <SpecTile icon={Scale} label="Miktar" value={formatKg(item.quantity)} />
                  {item.cut ? <SpecTile icon={Scissors} label="Kesim" value={item.cut} /> : null}
                  {item.packaging ? (
                    <SpecTile icon={Box} label="Ambalaj" value={item.packaging} />
                  ) : null}
                </div>

                {item.description ? (
                  <Card elevation="soft">
                    <CardContent className="p-6">
                      <h2 className="mb-3 text-h3">Açıklama</h2>
                      <p className="leading-relaxed text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                ) : null}
              </div>

              {/* Yan panel — fiyat ve aksiyonlar */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-4">
                  <Card className="overflow-hidden border-primary/15 shadow-hover">
                    <div className="h-1 bg-gradient-to-r from-primary via-accent to-secondary" />
                    <CardContent className="space-y-5 p-6">
                      <div>
                        <p className="text-caption text-muted-foreground">Birim fiyat</p>
                        <p className="mt-1 text-3xl font-bold tracking-tight text-primary">
                          {formatTry(item.pricePerKg)}
                          <span className="ml-1 text-base font-medium text-muted-foreground">/ kg</span>
                        </p>
                        {totalEstimate ? (
                          <p className="mt-2 text-small text-muted-foreground">
                            Tahmini toplam ({formatKg(item.quantity)}):{' '}
                            <span className="font-semibold text-foreground">{totalEstimate}</span>
                          </p>
                        ) : null}
                      </div>

                      {favoriteError ? (
                        <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                          {favoriteError}
                        </p>
                      ) : null}

                      <div className="space-y-2">
                        {isOpen ? (
                          <Button
                            variant="primary"
                            className="w-full"
                            size="lg"
                            type="button"
                            onClick={() => setOfferOpen(true)}
                          >
                            Teklif ver
                          </Button>
                        ) : (
                          <p className="rounded-lg bg-muted px-3 py-2 text-center text-small text-muted-foreground">
                            Bu ilan şu an teklif kabul etmiyor.
                          </p>
                        )}

                        {item.slaughterhouseId != null ? (
                          <>
                            <MessageUserButton
                              otherUserId={item.slaughterhouseId}
                              contextLabel={item.title ?? 'Et ilanı'}
                              size="default"
                              className="w-full"
                            />
                            <Button
                              variant="outline"
                              className="w-full"
                              type="button"
                              disabled={!item.isFavoritedByMe && favoriteBlocked}
                              title={
                                !item.isFavoritedByMe && favoriteBlocked
                                  ? EMAIL_VERIFICATION_REQUIRED
                                  : undefined
                              }
                              onClick={() => void handleFavorite()}
                            >
                              <Heart
                                className={cn(
                                  'mr-2 size-4',
                                  item.isFavoritedByMe && 'fill-current text-destructive',
                                )}
                              />
                              {item.isFavoritedByMe ? 'Favoriden çıkar' : 'Favorile'}
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </CardContent>
                  </Card>

                  <Card elevation="soft">
                    <CardContent className="flex items-start gap-3 p-5">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                        <Factory className="size-5 text-secondary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-caption text-muted-foreground">Satıcı</p>
                        <p className="font-semibold">{slaughterhouse}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-small text-muted-foreground">
                          <MapPin className="size-3.5" />
                          {location}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </PageState>

      <CreateMeatOfferModal
        open={offerOpen}
        saleRequestId={item?.id ?? null}
        listingTitle={item?.title ?? ''}
        onClose={() => setOfferOpen(false)}
        onCreated={() => {
          setOfferOpen(false)
          if (validId) {
            getMeatListing(listingId).then(setItem).catch(() => {})
          }
        }}
      />
    </RoleAppPage>
  )
}
