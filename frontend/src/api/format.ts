import { apiUrl } from '../config/apiBase'

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=600'

export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url || url.trim() === '') return PLACEHOLDER_IMAGE
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return apiUrl(url.startsWith('/') ? url : `/${url}`)
}

export function formatTry(value: number | string | null | undefined): string {
  if (value == null || value === '') return '—'
  const n = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(n)) return String(value)
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(n)
}

export function formatKg(value: number | string | null | undefined): string {
  if (value == null || value === '') return '—'
  const n = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(n)) return String(value)
  if (n >= 1000) return `${(n / 1000).toLocaleString('tr-TR', { maximumFractionDigits: 1 })} ton`
  return `${n.toLocaleString('tr-TR')} kg`
}

export function formatHeadCount(count: number | null | undefined): string {
  if (count == null) return '—'
  return `${count} baş`
}

export function formatDateTr(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

export function formatRelativeTr(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  const diff = Date.now() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Az önce'
  if (mins < 60) return `${mins} dk önce`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} saat önce`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Dün'
  if (days < 7) return `${days} gün önce`
  return formatDateTr(iso)
}

export function requestStatusLabel(status: string): string {
  return status === 'OPEN' ? 'Açık' : 'Kapalı'
}

export function listingCardStatusLabel(status: 'open' | 'closed' | 'pending'): string {
  if (status === 'open') return 'Açık'
  if (status === 'closed') return 'Kapalı'
  return 'Beklemede'
}

export function orderStatusLabel(status: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'Tamamlandı'
    case 'PENDING':
      return 'Beklemede'
    case 'CANCELLED':
      return 'İptal edildi'
    default:
      return status
  }
}

export function offerStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'Beklemede'
    case 'ACCEPTED':
      return 'Kabul edildi'
    case 'REJECTED':
      return 'Reddedildi'
    default:
      return status
  }
}

export { PLACEHOLDER_IMAGE }
