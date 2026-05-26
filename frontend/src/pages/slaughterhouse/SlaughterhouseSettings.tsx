import { ProfileSettingsForm } from '../../components/role-app/ProfileSettingsForm'
import { SlaughterhouseFavoriteSellers } from '../../components/role-app/SlaughterhouseFavoriteSellers'
import { SlaughterhouseTradeHistory } from '../../components/role-app/SlaughterhouseTradeHistory'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'

export function SlaughterhouseSettings() {
  return (
    <RoleAppPage>
      <div className="mb-8">
        <h1 className="mb-2">Ayarlar</h1>
        <p className="text-muted-foreground">Profil ve hesap bilgilerinizi güncelleyin</p>
      </div>
      <ProfileSettingsForm />
      <SlaughterhouseFavoriteSellers />
      <SlaughterhouseTradeHistory />
    </RoleAppPage>
  )
}
