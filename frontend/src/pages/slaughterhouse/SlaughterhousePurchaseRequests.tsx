import { useMemo, useState } from 'react'
import { Plus, RotateCcw, XCircle, Users, Pencil } from 'lucide-react'
import { Button } from '../../components/role-app/Button'
import { Badge } from '../../components/role-app/Badge'
import { Card, CardContent } from '../../components/role-app/Card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/role-app/Tabs'
import { PageState } from '../../components/role-app/PageState'
import { CreateAnimalPurchaseRequestModal } from '../../components/role-app/CreateAnimalPurchaseRequestModal'
import { PurchaseRequestOffersModal } from '../../components/role-app/PurchaseRequestOffersModal'
import { ApiError } from '../../api/client'
import { useApi } from '../../hooks/useApi'
import { useSyncedSearchQuery } from '../../hooks/useSyncedSearchQuery'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import * as shApi from '../../api/slaughterhouse'
import { EMAIL_VERIFICATION_REQUIRED } from '../../lib/emailVerification'
import { animalCategoryLabel } from '../../api/mappers'
import { formatDateTr, formatHeadCount, formatKg, requestStatusLabel } from '../../api/format'
import type { AnimalPurchaseRequestDto } from '../../api/types'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

export function SlaughterhousePurchaseRequests() {
  const [tab, setTab] = useState<'open' | 'closed' | 'all'>('open')
  const [showCreate, setShowCreate] = useState(false)
  const [offersTarget, setOffersTarget] = useState<AnimalPurchaseRequestDto | null>(null)
  const [editTarget, setEditTarget] = useState<AnimalPurchaseRequestDto | null>(null)
  const [closingId, setClosingId] = useState<number | null>(null)
  const [reopeningId, setReopeningId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const { blocked } = useEmailVerificationGate()
  const [searchQuery, setSearchQuery] = useSyncedSearchQuery()
  const { data, loading, error, reload } = useApi(
    () => shApi.listMyAnimalPurchaseRequests({ q: searchQuery }),
    [searchQuery],
  )

  const filtered = useMemo(() => {
    const items = data ?? []
    if (tab === 'all') return items
    if (tab === 'open') return items.filter((r) => r.status === 'OPEN')
    return items.filter((r) => r.status !== 'OPEN')
  }, [data, tab])

  const stats = useMemo(() => {
    const items = data ?? []
    return {
      all: items.length,
      open: items.filter((r) => r.status === 'OPEN').length,
      closed: items.filter((r) => r.status !== 'OPEN').length,
    }
  }, [data])

  async function handleClose(requestId: number) {
    if (!window.confirm('Bu alış talebini kapatmak istediğinize emin misiniz?')) return
    setClosingId(requestId)
    setActionError(null)
    try {
      await shApi.closeAnimalPurchaseRequest(requestId)
      reload()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Talep kapatılamadı')
    } finally {
      setClosingId(null)
    }
  }

  async function handleReopen(requestId: number) {
    if (!window.confirm('Bu alış talebini yeniden açmak istediğinize emin misiniz?')) return
    setReopeningId(requestId)
    setActionError(null)
    try {
      await shApi.reopenAnimalPurchaseRequest(requestId)
      reload()
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Talep açılamadı')
    } finally {
      setReopeningId(null)
    }
  }

  return (
    <RoleAppPage>
      <PageHeader
        title="Hayvan alış taleplerim"
        description="Satıcıların teklif verebileceği alım taleplerinizi yönetin"
        actions={
          <Button variant="primary" type="button" onClick={() => setShowCreate(true)}>
            <Plus className="size-4 mr-2" />
            Yeni talep
          </Button>
        }
      />
      {searchQuery.trim() ? (
        <p className="text-small text-muted-foreground -mt-4 mb-6 w-full">
          &ldquo;{searchQuery.trim()}&rdquo; için {filtered.length} talep
        </p>
      ) : null}
      {actionError ? (
        <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
          {actionError}
        </p>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatMini label="Toplam" value={stats.all} />
        <StatMini label="Açık" value={stats.open} />
        <StatMini label="Kapalı" value={stats.closed} />
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
        <TabsList className="mb-6">
          <TabsTrigger value="open">Açık ({stats.open})</TabsTrigger>
          <TabsTrigger value="closed">Kapalı ({stats.closed})</TabsTrigger>
          <TabsTrigger value="all">Tümü ({stats.all})</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          <PageState
            loading={loading}
            error={error}
            onRetry={reload}
            empty={filtered.length === 0}
            emptyMessage={
              searchQuery.trim()
                ? 'Aramanıza uygun talep bulunamadı.'
                : tab === 'open'
                  ? 'Açık alış talebiniz yok. Yeni talep oluşturarak satıcılara ulaşın.'
                  : 'Bu filtrede talep bulunamadı.'
            }
            emptyAction={
              searchQuery.trim() ? (
                <Button variant="secondary" type="button" onClick={() => setSearchQuery('')}>
                  Aramayı temizle
                </Button>
              ) : tab === 'open' ? (
                <Button variant="primary" type="button" onClick={() => setShowCreate(true)}>
                  İlk talebinizi oluşturun
                </Button>
              ) : undefined
            }
          >
            <div className="space-y-4">
              {filtered.map((req) => (
                <RequestRow
                  key={req.id}
                  request={req}
                  closing={closingId === req.id}
                  closeBlocked={blocked}
                  reopening={reopeningId === req.id}
                  reopenBlocked={blocked}
                  onViewOffers={() => setOffersTarget(req)}
                  onEdit={() => setEditTarget(req)}
                  onClose={() => void handleClose(req.id)}
                  onReopen={() => void handleReopen(req.id)}
                />
              ))}
            </div>
          </PageState>
        </TabsContent>
      </Tabs>

      <CreateAnimalPurchaseRequestModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={reload}
      />
      <CreateAnimalPurchaseRequestModal
        open={editTarget != null}
        request={editTarget}
        onClose={() => setEditTarget(null)}
        onCreated={() => {
          setEditTarget(null)
          reload()
        }}
      />
      <PurchaseRequestOffersModal
        request={offersTarget}
        open={offersTarget != null}
        onClose={() => setOffersTarget(null)}
        onUpdated={reload}
      />
    </RoleAppPage>
  )
}

function RequestRow({
  request,
  closing,
  closeBlocked,
  reopening,
  reopenBlocked,
  onViewOffers,
  onEdit,
  onClose,
  onReopen,
}: {
  request: AnimalPurchaseRequestDto
  closing: boolean
  closeBlocked: boolean
  reopening: boolean
  reopenBlocked: boolean
  onViewOffers: () => void
  onEdit: () => void
  onClose: () => void
  onReopen: () => void
}) {
  const isOpen = request.status === 'OPEN'
  const pending = request.pendingOfferCount ?? 0
  const total = request.offerCount ?? 0

  return (
    <Card>
      <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-medium">{request.title}</h3>
            <Badge variant={isOpen ? 'open' : 'closed'}>{requestStatusLabel(request.status)}</Badge>
            {total > 0 ? (
              <Badge variant="secondary" className="gap-1">
                <Users className="size-3" />
                {total} teklif
                {pending > 0 ? ` · ${pending} beklemede` : ''}
              </Badge>
            ) : null}
          </div>
          <p className="text-small text-muted-foreground line-clamp-2">
            {request.description || '—'}
          </p>
          <p className="text-caption text-muted-foreground mt-2">
            {animalCategoryLabel(request.animalCategory)} · {formatHeadCount(request.quantity)} ·{' '}
            {formatKg(request.expectedWeight)} · {formatDateTr(request.createdAt)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={onViewOffers}>
            Teklifleri gör{pending > 0 ? ` (${pending})` : ''}
          </Button>
          {isOpen ? (
            <>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil className="size-4 mr-1" />
                Düzenle
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={closing || closeBlocked}
                title={closeBlocked ? EMAIL_VERIFICATION_REQUIRED : undefined}
                onClick={onClose}
              >
                <XCircle className="size-4 mr-1" />
                {closing ? 'Kapatılıyor…' : 'Kapat'}
              </Button>
            </>
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
      </CardContent>
    </Card>
  )
}

function StatMini({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-caption text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </CardContent>
    </Card>
  )
}