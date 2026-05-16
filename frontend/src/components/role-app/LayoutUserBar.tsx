import { NavLink } from 'react-router-dom'
import { Factory } from 'lucide-react'
import { RolePill } from './RolePill'
import { useMe } from '../../hooks/useMe'
import { resolveMediaUrl } from '../../api/format'
import { userDisplayName, userInitials } from '../../lib/userDisplay'
import type { UserRole } from '../../types/me'

type LayoutUserBarProps = {
  role: UserRole
  settingsPath: string
}

export function LayoutUserBar({ role, settingsPath }: LayoutUserBarProps) {
  const { user } = useMe()

  const name = user ? userDisplayName(user) : '…'
  const initials = user ? userInitials(name) : '…'

  return (
    <NavLink
      to={settingsPath}
      className="hidden sm:flex items-center gap-3 ml-2 pl-2 border-l border-border hover:opacity-90 transition-opacity"
    >
      <div className="text-right">
        <p className="text-small font-medium line-clamp-1 max-w-[160px]">{name}</p>
        <RolePill role={role} className="mt-0.5" />
      </div>
      <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {user?.profileImageUrl ? (
          <img src={resolveMediaUrl(user.profileImageUrl)} alt="" className="size-full object-cover" />
        ) : role === 'SLAUGHTERHOUSE' ? (
          <Factory className="size-5 text-primary" />
        ) : (
          <span className="text-caption font-medium text-primary">{initials}</span>
        )}
      </div>
    </NavLink>
  )
}
