import type { MeUser } from '../../types/me'
import { isBuyer, isBusiness, isSeller } from '../../types/me'
import { Avatar } from './Avatar'
import { Badge } from './Badge'

type Props = {
  user: MeUser
}

function roleBadgeLabel(user: MeUser) {
  const r = isBuyer(user.role) ? 'Et alıcı' : isSeller(user.role) ? 'Hayvan satıcı' : 'Yönetici'
  const t = isBusiness(user.accountType) ? 'İşletme' : 'Bireysel'
  return `${r} · ${t}`
}

export function TopNav({ user }: Props) {
  return (
    <header className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100/90 bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
      <div>
        <p className="text-xs font-medium text-gray-500">Hoş geldiniz</p>
        <p className="font-display text-lg font-semibold text-gray-900">{user.name}</p>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant="role">{roleBadgeLabel(user)}</Badge>
        <button
          type="button"
          className="relative rounded-xl p-2 text-gray-500 transition hover:bg-clinical-50 hover:text-clinical-700"
          aria-label="Bildirimler"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
          </svg>
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-clinical-500 ring-2 ring-white" />
        </button>
        <Avatar src={user.profileImageUrl} name={user.name} size="sm" />
      </div>
    </header>
  )
}
