import type { MeUser } from '../types/me'

export const EMAIL_VERIFICATION_REQUIRED =
  'Bu işlem için önce e-posta adresinizi doğrulamanız gerekir'

export function isEmailVerified(user: MeUser | null | undefined): boolean {
  return Boolean(user?.emailVerified)
}

export function requiresEmailVerification(user: MeUser | null | undefined): boolean {
  return Boolean(user && !user.emailVerified)
}
