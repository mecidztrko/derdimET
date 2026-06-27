import { ProfileSettingsForm } from '../../components/role-app/ProfileSettingsForm'
import { ChangePasswordCard } from '../../components/role-app/ChangePasswordCard'
import { BusinessVerificationCard } from '../../components/role-app/BusinessVerificationCard'
import { SellerFavoriteSlaughterhouses } from '../../components/role-app/SellerFavoriteSlaughterhouses'
import { SellerSalesCard } from '../../components/role-app/SellerSalesCard'
import { RoleAppPage } from '../../components/role-app/RoleAppPage'
import { PageHeader } from '../../components/role-app/PageHeader'

export function SellerSettings() {
  return (
    <RoleAppPage>
      <PageHeader title="Ayarlar" description="Hesap ve bildirim tercihleri" />
      <ProfileSettingsForm />
      <ChangePasswordCard />
      <BusinessVerificationCard />
      <SellerFavoriteSlaughterhouses />
      <SellerSalesCard />
    </RoleAppPage>
  )
}
