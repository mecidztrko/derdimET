import { apiFetch } from './client'
import type { UpdateProfileBody } from './types'

export type MeResponse = {
  id: number
  email: string
  name: string
  role: string
  phone?: string | null
  companyName?: string | null
  taxNumber?: string | null
  addressLine?: string | null
  city?: string | null
  contactSecondaryName?: string | null
  contactSecondaryPhone?: string | null
  profileImageUrl?: string | null
  emailVerified?: boolean
}

export function getMe(): Promise<MeResponse> {
  return apiFetch('/api/me')
}

export function updateProfile(body: UpdateProfileBody): Promise<MeResponse> {
  return apiFetch('/api/me', {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}
