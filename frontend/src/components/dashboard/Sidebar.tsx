import type { ReactNode } from 'react'
import type { MeUser } from '../../types/me'
import { isBuyer, isSeller } from '../../types/me'

export type NavKey = 'profile' | 'commerce' | 'messages' | 'settings'

type Props = {
  user: MeUser
  active: NavKey
  onNavigate: (key: NavKey) => void
}

const Item = ({
  icon,
  label,
  active,
  onClick,
}: {
  icon: ReactNode
  label: string
  active: boolean
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition ${
      active
        ? 'bg-clinical-600 text-white shadow-md'
        : 'text-gray-600 hover:bg-white hover:text-gray-900'
    }`}
  >
    <span className={active ? 'text-white' : 'text-clinical-500'}>{icon}</span>
    {label}
  </button>
)

export function Sidebar({ user, active, onNavigate }: Props) {
  const commerceLabel = isBuyer(user.role) ? 'Satın almalarım' : isSeller(user.role) ? 'İlanlarım' : 'İşlemler'

  return (
    <aside className="flex w-full shrink-0 flex-col gap-1 rounded-2xl border border-gray-100/90 bg-white/80 p-3 shadow-card backdrop-blur-sm lg:w-60">
      <p className="mb-2 px-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">Menü</p>
      <Item
        icon={<IconUser />}
        label="Profil"
        active={active === 'profile'}
        onClick={() => onNavigate('profile')}
      />
      <Item
        icon={<IconBox />}
        label={commerceLabel}
        active={active === 'commerce'}
        onClick={() => onNavigate('commerce')}
      />
      <Item
        icon={<IconChat />}
        label="Mesajlar"
        active={active === 'messages'}
        onClick={() => onNavigate('messages')}
      />
      <Item
        icon={<IconGear />}
        label="Ayarlar"
        active={active === 'settings'}
        onClick={() => onNavigate('settings')}
      />
      <form action="/logout" method="post" className="mt-4 border-t border-gray-100 pt-3">
        <button
          type="submit"
          className="flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          Çıkış yap
        </button>
      </form>
    </aside>
  )
}

function IconUser() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function IconBox() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  )
}

function IconChat() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337L5.05 21l1.395-3.72C5.512 15.042 5 13.574 5 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
  )
}

function IconGear() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
