import { cn } from '../../lib/cn'

type Role = 'ANIMAL_SELLER' | 'SLAUGHTERHOUSE' | 'MEAT_BUYER' | 'ADMIN'

interface RolePillProps {
  role: Role
  className?: string
}

const roleConfig: Record<Role, { label: string; color: string }> = {
  ANIMAL_SELLER: {
    label: 'Hayvan Satıcısı',
    color: 'bg-secondary/10 text-secondary border-secondary/20',
  },
  SLAUGHTERHOUSE: {
    label: 'Kesimhane',
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  MEAT_BUYER: {
    label: 'Et Alıcısı',
    color: 'bg-primary/10 text-primary border-primary/20',
  },
  ADMIN: {
    label: 'Admin',
    color: 'bg-muted text-foreground border-border',
  },
}

export function RolePill({ role, className }: RolePillProps) {
  const config = roleConfig[role]

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-caption font-medium border',
        config.color,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
