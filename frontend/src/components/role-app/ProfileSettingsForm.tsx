import { useEffect, useRef, useState } from 'react'
import { Building, Camera, Mail, MapPin, Phone, Save, User } from 'lucide-react'
import { updateProfile } from '../../api/profile'
import { uploadProfileImage } from '../../api/media'
import { ApiError } from '../../api/client'
import { resolveMediaUrl } from '../../api/format'
import { useMe } from '../../hooks/useMe'
import { Button } from './Button'
import { Card, CardContent } from './Card'
import { Input } from './Input'

export function ProfileSettingsForm() {
  const { user, refetch } = useMe()
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    companyName: '',
    taxNumber: '',
    addressLine: '',
    city: '',
    contactSecondaryName: '',
    contactSecondaryPhone: '',
  })

  useEffect(() => {
    if (!user) return
    setForm({
      name: user.name ?? '',
      phone: user.phone ?? '',
      companyName: user.companyName ?? '',
      taxNumber: user.taxNumber ?? '',
      addressLine: user.addressLine ?? '',
      city: user.city ?? '',
      contactSecondaryName: user.contactSecondaryName ?? '',
      contactSecondaryPhone: user.contactSecondaryPhone ?? '',
    })
  }, [user])

  async function handlePhotoChange(file: File | null) {
    if (!file) return
    setUploadingPhoto(true)
    setMessage(null)
    try {
      const url = await uploadProfileImage(file)
      await updateProfile({ profileImageUrl: url })
      await refetch()
      setMessage('Profil fotoğrafı güncellendi.')
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : 'Fotoğraf yüklenemedi')
    } finally {
      setUploadingPhoto(false)
      if (photoInputRef.current) photoInputRef.current.value = ''
    }
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      await updateProfile({
        name: form.name.trim() || undefined,
        phone: form.phone.trim() || null,
        companyName: form.companyName.trim() || null,
        taxNumber: form.taxNumber.trim() || null,
        addressLine: form.addressLine.trim() || null,
        city: form.city.trim() || null,
        contactSecondaryName: form.contactSecondaryName.trim() || null,
        contactSecondaryPhone: form.contactSecondaryPhone.trim() || null,
      })
      await refetch()
      setMessage('Profil kaydedildi.')
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : 'Kayıt başarısız')
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">Profil yükleniyor…</CardContent>
      </Card>
    )
  }

  const initials = form.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-6">Profil ve firma bilgileri</h3>
        {message ? (
          <p className="mb-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">{message}</p>
        ) : null}
        <div className="flex items-center gap-6 mb-6 flex-wrap">
          <div className="relative">
            <div className="size-20 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden">
              {user.profileImageUrl ? (
                <img
                  src={resolveMediaUrl(user.profileImageUrl)}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <span className="text-h3 font-medium text-primary">{initials || '?'}</span>
              )}
            </div>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => void handlePhotoChange(e.target.files?.[0] ?? null)}
            />
          </div>
          <div>
            <p className="text-caption text-muted-foreground mb-2">{user.email}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploadingPhoto}
              onClick={() => photoInputRef.current?.click()}
            >
              <Camera className="size-4 mr-2" />
              {uploadingPhoto ? 'Yükleniyor…' : 'Fotoğraf değiştir'}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-small font-medium mb-2 block">Ad Soyad</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              icon={User}
            />
          </div>
          <div>
            <label className="text-small font-medium mb-2 block">E-posta</label>
            <Input type="email" value={user.email} disabled icon={Mail} />
          </div>
          <div>
            <label className="text-small font-medium mb-2 block">Telefon</label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              icon={Phone}
            />
          </div>
          <div>
            <label className="text-small font-medium mb-2 block">Firma adı</label>
            <Input
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              icon={Building}
            />
          </div>
          <div>
            <label className="text-small font-medium mb-2 block">Vergi numarası</label>
            <Input
              value={form.taxNumber}
              onChange={(e) => setForm({ ...form, taxNumber: e.target.value })}
            />
          </div>
          <div>
            <label className="text-small font-medium mb-2 block">Şehir</label>
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              icon={MapPin}
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-small font-medium mb-2 block">Adres</label>
            <Input
              value={form.addressLine}
              onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
              icon={MapPin}
            />
          </div>
        </div>
        <div className="flex justify-end pt-6">
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            <Save className="size-4 mr-2" />
            {saving ? 'Kaydediliyor…' : 'Değişiklikleri kaydet'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
