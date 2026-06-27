import { useMemo, useState } from 'react'
import { RotateCcw, XCircle } from 'lucide-react'
import { Card, CardContent } from '../../components/role-app/Card'
import { Button } from '../../components/role-app/Button'
import { Badge } from '../../components/role-app/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { PageState } from '../../components/role-app/PageState'
import { CreateAnimalListingModal } from '../../components/role-app/CreateAnimalListingModal'
import { Plus, MapPin, Calendar, Pencil } from 'lucide-react'
import { ApiError } from '../../api/client'
import { useApi } from '../../hooks/useApi'
import { useSyncedSearchQuery } from '../../hooks/useSyncedSearchQuery'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import * as sellerApi from '../../api/seller'
import { EMAIL_VERIFICATION_REQUIRED } from '../../lib/emailVerification'
import { animalCategoryLabel } from '../../api/mappers'
import {
  formatDateTr,
  formatHeadCount,
  formatKg,
  formatTry,
  requestStatusLabel,
  resolveListingLocation,
  resolveMediaUrl,
} from '../../api/format'
import type { SellerAnimalListingDto } from '../../api/types'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

export function SellerListings() {
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'closed'>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editListing, setEditListing] = useState<SellerAnimalListingDto | null>(null)
  const [closingId, setClosingId] = useState<number | null>(null)
  const [reopeningId, setReopeningId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const { blocked } = useEmailVerificationGate()
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery()

  const listingsQuery = useApi(
    () => sellerApi.listMyAnimalListings({ q: searchQuery }),
    [searchQuery],
  )
  const incomingQuery = useApi(() => sellerApi.listIncomingListingOffers(), [])

  const listings = listingsQuery.data ?? []
  const offerCountByListing = useMemo(() => {
    const map = new Map<number, number>()
    for (const o of incomingQuery.data ?? []) {
      if (o.listingId != null) {
        map.set(o.listingId, (map.get(o.listingId) ?? 0) + 1)
      }
    }
    return map
  }, [incomingQuery.data])

  const filteredListings = useMemo(() => {
    if (activeTab === 'all') return listings
    if (activeTab === 'open') return listings.filter((l) => l.status === 'OPEN')
    return listings.filter((l) => l.status === 'CLOSED')
  }, [listings, activeTab])

  const stats = useMemo(
    () => ({
      all: listings.length,
      open: listings.filter((l) => l.status === 'OPEN').length,
      closed: listings.filter((l) => l.status === 'CLOSED').length,
    }),
    [listings],
  )

  async function handleClose(listingId: number) {
    if (!window.confirm('Bu ilanı kapatmak istediğinize emin misiniz?')) return
    setClosingId(listingId)
    setActionError(null)
    try {
      await sellerApi.closeAnimalListing(listingId)
      listingsQuery.reload()
      incomingQuery.reload()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'İlan kapatılamadı')
    } finally {
      setClosingId(null)
    }
  }

  async function handleReopen(listingId: number) {
    if (!window.confirm('Bu ilanı yeniden açmak istediğinize emin misiniz?')) return
    setReopeningId(listingId)
    setActionError(null)
    try {
      await sellerApi.reopenAnimalListing(listingId)
      listingsQuery.reload()
      incomingQuery.reload()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'İlan açılamadı')
    } finally {
      setReopeningId(null)
    }
  }

  return (
    <RoleAppPage>
      <PageHeader
        title="Hayvan ilanlarım"
        description="İlanlarınızı oluşturun ve yönetin"
        actions={
          <Button variant="primary" type="button" onClick={() => setShowCreateModal(true)}>
            <Plus className="size-4 mr-2" />
            Yeni ilan
          </Button>
        }
      />
      {searchQuery.trim() ? (
        <p className="text-small text-muted-foreground -mt-4 mb-6">
          &ldquo;{searchQuery.trim()}&rdquo; için {filteredListings.length} ilan
        </p>
      ) : null}
      {actionError ? (
        <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {actionError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatMini label="Toplam ilan" value={stats.all} />
        <StatMini label="Açık" value={stats.open} />
        <StatMini label="Kapalı" value={stats.closed} />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tümü ({stats.all})</TabsTrigger>
          <TabsTrigger value="open">Açık ({stats.open})</TabsTrigger>
          <TabsTrigger value="closed">Kapalı ({stats.closed})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <PageState
            loading={listingsQuery.loading}
            error={listingsQuery.error}
            onRetry={listingsQuery.reload}
            empty={filteredListings.length === 0}
            emptyMessage={
              searchQuery.trim()
                ? 'Aramanıza uygun ilan bulunamadı.'
                : stats.all === 0
                  ? 'Henüz hayvan ilanınız yok. İlk ilanınızı oluşturarak kesimhanelerin teklif vermesini sağlayın.'
                  : 'Bu filtrede ilan bulunamadı.'
            }
            emptyAction={
              searchQuery.trim() ? (
                <Button variant="secondary" type="button" onClick={() => setSearchQuery('')}>
                  Aramayı temizle
                </Button>
              ) : stats.all === 0 ? (
                <Button variant="primary" type="button" onClick={() => setShowCreateModal(true)}>
                  İlk ilanınızı oluşturun
                </Button>
              ) : undefined
            }
          >
            <div className="space-y-4">
              {filteredListings.map((listing) => (
                <ListingRow
                  key={listing.id}
                  listing={listing}
                  offerCount={offerCountByListing.get(listing.id) ?? 0}
                  closing={closingId === listing.id}
                  closeBlocked={blocked}
                  reopening={reopeningId === listing.id}
                  reopenBlocked={blocked}
                  onClose={() => void handleClose(listing.id)}
                  onReopen={() => void handleReopen(listing.id)}
                  onEdit={() => setEditListing(listing)}
                />
              ))}
            </div>
          </PageState>
        </TabsContent>
      </Tabs>

      <CreateAnimalListingModal
        open={showCreateModal || editListing != null}
        listing={editListing}
        onClose={() => {
          setShowCreateModal(false)
          setEditListing(null)
        }}
        onCreated={() => {
          listingsQuery.reload()
          incomingQuery.reload()
        }}
      />
    </RoleAppPage>
  )
}

function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <Card elevation="soft">
      <CardContent className="py-4">
        <p className="text-caption text-muted-foreground">{label}</p>
        <p className="text-h3 font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}

function ListingRow({
  listing,
  offerCount,
  closing,
  closeBlocked,
  reopening,
  reopenBlocked,
  onClose,
  onReopen,
  onEdit,
}: {
  listing: SellerAnimalListingDto
  offerCount: number
  closing: boolean
  closeBlocked: boolean
  reopening: boolean
  reopenBlocked: boolean
  onClose: () => void
  onReopen: () => void
  onEdit: () => void
}) {
  const title = [listing.type, listing.breed].filter(Boolean).join(' · ') || 'Hayvan ilanı'
  const isOpen = listing.status === 'OPEN'

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex gap-4">
          <img
            src={resolveMediaUrl(listing.imageUrls?.[0])}
            alt={title}
            className="size-32 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="truncate">{title}</h3>
                  <Badge variant={isOpen ? 'open' : 'closed'}>
                    {requestStatusLabel(listing.status)}
                  </Badge>
                </div>
                <p className="text-small text-muted-foreground flex items-center gap-1">
                  <MapPin className="size-3" />
                  {resolveListingLocation(listing.location, listing.sellerCity, '—')}
                </p>
                <p className="text-small text-muted-foreground flex items-center gap-1">
                  <Calendar className="size-3" />
                  {formatDateTr(listing.createdAt)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-caption text-muted-foreground">Kategori</p>
                <p className="font-medium">{animalCategoryLabel(listing.category)}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Miktar</p>
                <p className="font-medium">{formatHeadCount(listing.quantity)}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Fiyat / kg</p>
                <p className="font-semibold text-primary">{formatTry(listing.price)}</p>
              </div>
              <div>
                <p className="text-caption text-muted-foreground">Ort. ağırlık</p>
                <p className="font-medium">{formatKg(listing.avgWeightKg)}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-border">
              <p className="text-small text-muted-foreground">{offerCount} kesimhane teklifi</p>
              {isOpen ? (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={onEdit}>
                    <Pencil className="size-4 mr-1" />
                    Düzenle
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={closing || closeBlocked}
                    title={closeBlocked ? EMAIL_VERIFICATION_REQUIRED : undefined}
                    onClick={onClose}
                  >
                    <XCircle className="size-4 mr-1" />
                    {closing ? 'Kapatılıyor…' : 'Kapat'}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={reopening || reopenBlocked}
                  title={reopenBlocked ? EMAIL_VERIFICATION_REQUIRED : undefined}
                  onClick={onReopen}
                >
                  <RotateCcw className="size-4 mr-1" />
                  {reopening ? 'Açılıyor…' : 'Yeniden aç'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
