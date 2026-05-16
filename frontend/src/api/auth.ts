import { apiFetchVoid } from './client'

export async function sessionLogin(email: string, password: string): Promise<void> {
  await apiFetchVoid('/api/auth/session-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}
