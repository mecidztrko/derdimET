import { ProfileSettingsForm } from '../../components/role-app/ProfileSettingsForm'
import { ChangePasswordCard } from '../../components/role-app/ChangePasswordCard'
import { BusinessVerificationCard } from '../../components/role-app/BusinessVerificationCard'
import { BuyerPurchasesCard } from '../../components/role-app/BuyerPurchasesCard'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

export function BuyerSettings() {
  return (
    <RoleAppPage>
      <PageHeader title="Ayarlar" description="Hesap ve bildirim tercihleri" />
      <ProfileSettingsForm />
      <ChangePasswordCard />
      <BusinessVerificationCard />
      <BuyerPurchasesCard />
    </RoleAppPage>
  )
}
