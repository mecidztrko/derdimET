import { ProfileSettingsForm } from '../../components/role-app/ProfileSettingsForm'
import { SlaughterhouseTradeHistory } from '../../components/role-app/SlaughterhouseTradeHistory'

export function SlaughterhouseSettings() {
  return (
    <div className="max-w-[1440px] mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="mb-2">Ayarlar</h1>
        <p className="text-muted-foreground">Profil ve hesap bilgilerinizi güncelleyin</p>
      </div>
      <ProfileSettingsForm />
      <SlaughterhouseTradeHistory />
    </div>
  )
}
