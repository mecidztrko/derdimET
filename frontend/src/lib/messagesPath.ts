export function messagesPathForRole(role: string): string {
  if (role === 'MEAT_BUYER') return '/buyer/messages'
  if (role === 'ANIMAL_SELLER') return '/seller/messages'
  if (role === 'SLAUGHTERHOUSE') return '/slaughterhouse/messages'
  return '/role-selector'
}
