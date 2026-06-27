import { apiFetch } from './client'

export type BusinessVerificationStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED'

export type BusinessVerificationResponse = {
  userId: number
  name: string
  email: string
  role: string
  companyName: string | null
  taxNumber: string | null
  documentUrl: string | null
  status: BusinessVerificationStatus
  note: string | null
}

export function submitBusinessVerification(documentUrl: string): Promise<BusinessVerificationResponse> {
  return apiFetch('/api/me/business-verification', {
    method: 'POST',
    body: JSON.stringify({ documentUrl }),
  })
}
