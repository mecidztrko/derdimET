import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import { Button } from './Button'

type LogoutButtonProps = {
  placement?: 'default' | 'header' | 'sidebar'
}

/** Spring Security oturumunu sonlandırır; ardından giriş ekranına yönlendirir. */
export function LogoutButton({ placement = 'default' }: LogoutButtonProps) {
  const header = placement === 'header'
  const sidebar = placement === 'sidebar'
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/logout', { method: 'POST', credentials: 'include' })
    } catch {
      /* ağ hatası olsa bile giriş sayfasına dön */
    }
    const base = import.meta.env.BASE_URL
    window.location.replace(`${base}index.html?r=login#/login`)
  }

  return (
    <div className={cn('shrink-0', sidebar && 'w-full')}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        title="Çıkış yap"
        aria-label="Çıkış yap"
        disabled={loading}
        onClick={() => void handleLogout()}
        className={cn(
          'shrink-0 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive',
          header && 'h-9 px-2.5 sm:px-3',
          sidebar && 'h-10 w-full justify-center',
        )}
      >
        <LogOut className="size-4 shrink-0" />
        <span className="text-small font-medium">
          {loading ? 'Çıkış…' : sidebar || !header ? 'Çıkış yap' : 'Çıkış'}
        </span>
      </Button>
    </div>
  )
}
