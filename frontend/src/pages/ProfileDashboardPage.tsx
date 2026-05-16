import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'
import { AdminAnimalPurchaseForm } from '../components/animal-market/AdminAnimalPurchaseForm'
import { ProfileSettingsForm } from '../components/role-app/ProfileSettingsForm'
import { MessagesInbox } from '../components/role-app/MessagesInbox'
import { Button } from '../components/role-app/Button'
import { Card, CardContent } from '../components/role-app/Card'
import { Badge } from '../components/role-app/Badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/role-app/Tabs'
import { useMe } from '../hooks/useMe'
import { isAdmin, isBusiness } from '../types/me'
import { apiUrl } from '../config/apiBase'

export default function ProfileDashboardPage() {
  const { user, loading } = useMe()
  const [tab, setTab] = useState('admin')
  const [verifyCode, setVerifyCode] = useState('')
  const [verifyMsg, setVerifyMsg] = useState<string | null>(null)
  const [verifyErr, setVerifyErr] = useState<string | null>(null)
  const [verifyLoading, setVerifyLoading] = useState(false)

  if (loading) {
    return (
      <div className="role-app min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Profil yükleniyor…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin(user.role)) {
    return <Navigate to="/role-selector" replace />
  }

  const displayTitle = isBusiness(user.accountType) && user.companyName ? user.companyName : user.name
  const locationStr = [user.addressLine, user.city].filter(Boolean).join(' · ') || 'Konum eklenmedi'

  async function sendVerifyCode() {
    setVerifyErr(null)
    setVerifyMsg(null)
    try {
      const res = await fetch(apiUrl('/api/auth/verification/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user!.email }),
      })
      if (!res.ok) {
        setVerifyErr('Kod gönderilemedi')
        return
      }
      setVerifyMsg('Doğrulama kodu gönderildi.')
    } catch {
      setVerifyErr('Bağlantı hatası')
    }
  }

  async function confirmVerifyCode() {
    setVerifyErr(null)
    setVerifyMsg(null)
    setVerifyLoading(true)
    try {
      const res = await fetch(apiUrl('/api/auth/verification/confirm'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user!.email, code: verifyCode }),
      })
      if (!res.ok) {
        setVerifyErr('Kod doğrulanamadı')
        return
      }
      setVerifyMsg('E-posta doğrulandı. Sayfayı yenileyin.')
      setVerifyCode('')
    } catch {
      setVerifyErr('Bağlantı hatası')
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <div className="role-app min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-6 py-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Link
              to="/role-selector"
              className="inline-flex items-center text-small text-muted-foreground hover:text-foreground mb-3"
            >
              <ArrowLeft className="size-4 mr-1" />
              Portallara dön
            </Link>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="size-6 text-primary" />
              <h1>Yönetici paneli</h1>
            </div>
            <p className="text-muted-foreground">{displayTitle} · {locationStr}</p>
          </div>
          <Badge variant="open">ADMIN</Badge>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="admin">Yönetim</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="messages">Mesajlar</TabsTrigger>
            <TabsTrigger value="security">Güvenlik</TabsTrigger>
          </TabsList>

          <TabsContent value="admin">
            <Card className="mb-6">
              <CardContent className="p-6">
                <h2 className="font-medium mb-2">Hayvan alış talebi oluştur</h2>
                <p className="text-small text-muted-foreground mb-4">
                  Kesimhane adına açık alış talebi (satıcıların göreceği talepler).
                </p>
                <AdminAnimalPurchaseForm />
              </CardContent>
            </Card>
            <Card variant="alt" elevation="none">
              <CardContent className="py-4 text-small text-muted-foreground">
                Rol panellerine{' '}
                <Link to="/role-selector" className="text-primary font-medium underline">
                  buradan
                </Link>{' '}
                geçebilirsiniz (alıcı, satıcı, kesimhane).
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettingsForm />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesInbox />
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-medium mb-4">E-posta doğrulama</h2>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <p className="text-small">{user.email}</p>
                  {user.emailVerified ? (
                    <Badge variant="success">Doğrulandı</Badge>
                  ) : (
                    <Badge variant="warning">Doğrulanmadı</Badge>
                  )}
                </div>
                {!user.emailVerified && (
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={sendVerifyCode}>
                      Kod gönder
                    </Button>
                    <input
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="Doğrulama kodu"
                      className="min-w-[170px] rounded-lg border border-border px-3 py-2 text-small bg-card"
                    />
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      disabled={verifyLoading || verifyCode.trim().length === 0}
                      onClick={confirmVerifyCode}
                    >
                      {verifyLoading ? 'Doğrulanıyor…' : 'Kodu onayla'}
                    </Button>
                  </div>
                )}
                {verifyErr && <p className="mt-3 text-small text-destructive">{verifyErr}</p>}
                {verifyMsg && <p className="mt-3 text-small text-primary">{verifyMsg}</p>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
