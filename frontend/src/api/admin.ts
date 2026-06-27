import { apiFetch } from './client'
import type { AnimalCategory, AnimalPurchaseRequestDto } from './types'

export type AdminSlaughterhouseOptionDto = {
  id: number
  name: string
  email: string
}

export function listAdminSlaughterhouses(): Promise<AdminSlaughterhouseOptionDto[]> {
  return apiFetch('/api/admin/slaughterhouses')
}

export function adminCreateAnimalPurchaseRequest(body: {
  slaughterhouseUserId: number
  title: string
  animalCategory: AnimalCategory
  quantity?: number | null
  expectedWeight?: number | null
  description?: string | null
}): Promise<AnimalPurchaseRequestDto> {
  return apiFetch('/api/admin/animal-purchase-requests', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export type AdminBusinessVerificationDto = {
  userId: number
  name: string
  email: string
  role: string
  companyName: string | null
  taxNumber: string | null
  documentUrl: string | null
  status: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED'
  note: string | null
}

export function listPendingBusinessVerifications(): Promise<AdminBusinessVerificationDto[]> {
  return apiFetch('/api/admin/business-verifications')
}

export function approveBusinessVerification(userId: number): Promise<AdminBusinessVerificationDto> {
  return apiFetch(`/api/admin/business-verifications/${userId}/approve`, { method: 'POST' })
}

export function rejectBusinessVerification(
  userId: number,
  note?: string,
): Promise<AdminBusinessVerificationDto> {
  return apiFetch(`/api/admin/business-verifications/${userId}/reject`, {
    method: 'POST',
    body: JSON.stringify(note ? { note } : {}),
  })
}
