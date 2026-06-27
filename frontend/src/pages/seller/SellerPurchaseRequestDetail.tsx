import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Beef,
  Calendar,
  Factory,
  Heart,
  MapPin,
  Scale,
  Tag,
  TrendingUp,
  Users,
} from 'lucide-react'
import { getAnimalPurchaseRequest } from '../../api/listings'
import { toggleFavoriteUser } from '../../api/favorites'
import { ApiError } from '../../api/client'
import { animalCategoryLabel } from '../../api/mappers'
import { formatDateTr, formatHeadCount, formatKg } from '../../api/format'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { EMAIL_VERIFICATION_REQUIRED } from '../../lib/emailVerification'
import type { AnimalPurchaseRequestDto } from '../../api/types'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { Button } from '../../components/role-app/Button'
import { Card, CardContent } from '../../components/role-app/Card'
import { PageState } from '../../components/role-app/PageState'
import { CreateAnimalOfferModal } from '../../components/role-app/CreateAnimalOfferModal'
import { MessageUserButton } from '../../components/role-app/MessageUserButton'
import { UserReviewsSection } from '../../components/role-app/UserReviewsSection'
import { cn } from '../../lib/cn'

function SpecTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/80 p-4 shadow-soft backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4 shrink-0" />
        <span className="text-caption font-medium">{label}</span>
      </div>
      <p className="text-body font-semibold">{value}</p>
    </div>
  )
}

export function SellerPurchaseRequestDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const requestId = id ? Number(id) : NaN
  const validId = Number.isFinite(requestId) && requestId > 0

  const [item, setItem] = useState<AnimalPurchaseRequestDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favoriteError, setFavoriteError] = useState<string | null>(null)
  const [offerOpen, setOfferOpen] = useState(false)
  const { blocked: favoriteBlocked } = useEmailVerificationGate()

  useEffect(() => {
    if (!validId) {
      setLoading(false)
      setError('Geçersiz talep.')
      return
    }
    setLoading(true)
    setError(null)
    getAnimalPurchaseRequest(requestId)
      .then(setItem)
      .catch((e) => setError(e instanceof ApiError ? e.message : 'Talep yüklenemedi'))
      .finally(() => setLoading(false))
  }, [requestId, validId])

  const isOpen = item?.status === 'OPEN'
  const slaughterhouse =
    item?.slaughterhouseCompanyName || item?.slaughterhouseName || 'Kesimhane'
  const location = item?.slaughterhouseCity?.trim() || 'Konum belirtilmedi'

  async function handleFavorite() {
    if (!item?.slaughterhouseId) return
    const wasFavorited = !!item.isFavoritedByMe
    if (!wasFavorited && favoriteBlocked) {
      setFavoriteError(EMAIL_VERIFICATION_REQUIRED)
      return
    }
    setFavoriteError(null)
    const next = !wasFavorited
    setItem({ ...item, isFavoritedByMe: next })
    try {
      await toggleFavoriteUser(item.slaughterhouseId)
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
        error={error ?? (!validId ? 'Geçersiz talep.' : null)}
        onRetry={() => window.location.reload()}
        empty={!loading && !error && !item}
        emptyMessage="Alış talebi bulunamadı."
        emptyAction={
          <Link to="/seller">
            <Button variant="primary" type="button">
              Taleplere dön
            </Button>
          </Link>
        }
      >
        {item ? (
          <div className="space-y-8">
            <div className="overflow-hidden rounded-card border border-border/70 bg-card shadow-soft">
              <div className="relative flex aspect-[16/9] max-h-[280px] items-center justify-center bg-gradient-to-br from-secondary/[0.1] via-primary/[0.06] to-muted">
                <div className="pointer-events-none absolute inset-0 role-app-dot-grid opacity-30" />
                <div className="relative flex flex-col items-center gap-3 text-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-card/80 shadow-soft">
                    <Beef className="size-8 text-secondary" />
                  </div>
                  <p className="text-small font-medium text-muted-foreground">Kesimhane alış talebi</p>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="space-y-6 lg:col-span-2">
                <div>
                  <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-secondary/25 bg-secondary/[0.06] px-3 py-1 text-caption font-semibold text-secondary">
                    <Tag className="size-3.5" />
                    Hayvan alış talebi
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
                  {item.offerCount != null && item.offerCount > 0 ? (
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-small text-muted-foreground">
                      <TrendingUp className="size-4 text-primary" />
                      {item.offerCount} satıcı teklifi
                      {item.pendingOfferCount != null && item.pendingOfferCount > 0
                        ? ` · ${item.pendingOfferCount} beklemede`
                        : ''}
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <SpecTile
                    icon={Beef}
                    label="Kategori"
                    value={animalCategoryLabel(item.animalCategory)}
                  />
                  <SpecTile icon={Users} label="Adet" value={formatHeadCount(item.quantity)} />
                  <SpecTile
                    icon={Scale}
                    label="Beklenen ağırlık"
                    value={formatKg(item.expectedWeight)}
                  />
                </div>

                {item.description ? (
                  <Card elevation="soft">
                    <CardContent className="p-6">
                      <h2 className="mb-3 text-h3">Aradığı hayvan</h2>
                      <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                ) : null}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-6 space-y-4">
                  <Card className="overflow-hidden border-secondary/15 shadow-hover">
                    <div className="h-1 bg-gradient-to-r from-secondary via-primary to-accent" />
                    <CardContent className="space-y-5 p-6">
                      <div>
                        <p className="text-caption text-muted-foreground">Talep özeti</p>
                        <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                          {formatHeadCount(item.quantity)}
                        </p>
                        <p className="mt-1 text-small text-muted-foreground">
                          {animalCategoryLabel(item.animalCategory)} · ort. {formatKg(item.expectedWeight)}
                        </p>
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
                            Bu talep şu an teklif kabul etmiyor.
                          </p>
                        )}

                        {item.slaughterhouseId != null ? (
                          <>
                            <MessageUserButton
                              otherUserId={item.slaughterhouseId}
                              contextLabel={item.title}
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
                              {item.isFavoritedByMe ? 'Favoriden çıkar' : 'Kesimhaneyi favorile'}
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
                        <p className="text-caption text-muted-foreground">Kesimhane</p>
                        <p className="font-semibold">{slaughterhouse}</p>
                        <p className="mt-0.5 flex items-center gap-1 text-small text-muted-foreground">
                          <MapPin className="size-3.5" />
                          {location}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <UserReviewsSection userId={item.slaughterhouseId} allowCreate />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </PageState>

      <CreateAnimalOfferModal
        open={offerOpen}
        requestId={item?.id ?? null}
        requestTitle={item?.title ?? ''}
        onClose={() => setOfferOpen(false)}
        onCreated={() => {
          setOfferOpen(false)
          if (validId) {
            getAnimalPurchaseRequest(requestId).then(setItem).catch(() => {})
          }
        }}
      />
    </RoleAppPage>
  )
}
