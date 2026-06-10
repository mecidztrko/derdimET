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
