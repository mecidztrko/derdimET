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
  businessVerified?: boolean
  businessVerificationStatus?: string | null
  businessVerificationNote?: string | null
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

export function changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
  return apiFetch('/api/auth/password/change', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}
