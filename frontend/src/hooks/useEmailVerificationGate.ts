import { useMe } from './useMe'
import { requiresEmailVerification } from '../lib/emailVerification'

export function useEmailVerificationGate() {
  const { user } = useMe()
  return {
    blocked: requiresEmailVerification(user),
    email: user?.email,
  }
}
