/** Backend PasswordPolicyService ile uyumlu */
export const PASSWORD_POLICY_MESSAGE =
  'Şifre en az 8 karakter olmalı; büyük harf, küçük harf, rakam ve özel karakter içermelidir.'

export function validatePassword(password: string): string | null {
  if (password.length < 8 || password.length > 128) {
    return PASSWORD_POLICY_MESSAGE
  }
  let upper = false
  let lower = false
  let digit = false
  let special = false
  for (const c of password) {
    if (c >= 'A' && c <= 'Z') upper = true
    else if (c >= 'a' && c <= 'z') lower = true
    else if (c >= '0' && c <= '9') digit = true
    else special = true
  }
  if (!upper || !lower || !digit || !special) {
    return PASSWORD_POLICY_MESSAGE
  }
  return null
}

export async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { message?: string; detail?: string }
    return data.message || data.detail || `Hata (${res.status})`
  } catch {
    return res.statusText || 'İstek başarısız'
  }
}
