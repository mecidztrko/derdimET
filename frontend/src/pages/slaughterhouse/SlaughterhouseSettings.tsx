import { ProfileSettingsForm } from '../../components/role-app/ProfileSettingsForm'
import { ChangePasswordCard } from '../../components/role-app/ChangePasswordCard'
import { BusinessVerificationCard } from '../../components/role-app/BusinessVerificationCard'
import { SlaughterhouseFavoriteSellers } from '../../components/role-app/SlaughterhouseFavoriteSellers'
import { SlaughterhouseTradeHistory } from '../../components/role-app/SlaughterhouseTradeHistory'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

export function SlaughterhouseSettings() {
  return (
    <RoleAppPage>
      <PageHeader title="Ayarlar" description="Hesap ve bildirim tercihleri" />
      <ProfileSettingsForm />
      <ChangePasswordCard />
      <BusinessVerificationCard />
      <SlaughterhouseFavoriteSellers />
      <SlaughterhouseTradeHistory />
    </RoleAppPage>
  )
}
