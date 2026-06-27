export type UserRole = 'MEAT_BUYER' | 'ANIMAL_SELLER' | 'SLAUGHTERHOUSE' | 'ADMIN'
export type AccountType = 'INDIVIDUAL' | 'BUSINESS'

export type MeUser = {
  id: number
  email: string
  name: string
  role: string
  phone: string | null
  accountType: string
  companyName: string | null
  taxNumber: string | null
  addressLine: string | null
  city: string | null
  contactSecondaryName: string | null
  contactSecondaryPhone: string | null
  profileImageUrl: string | null
  emailVerified: boolean
  businessVerified: boolean
  businessVerificationStatus?: string | null
  businessVerificationNote?: string | null
}

export function isBuyer(role: string) {
  return role === 'MEAT_BUYER'
}

export function isSeller(role: string) {
  return role === 'ANIMAL_SELLER'
}

export function isAdmin(role: string) {
  return role === 'ADMIN'
}

export function isSlaughterhouse(role: string) {
  return role === 'SLAUGHTERHOUSE'
}

export function isBusiness(accountType: string) {
  return accountType === 'BUSINESS'
}
