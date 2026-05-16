import { apiUrl } from '../config/apiBase'

async function uploadMultipart(path: string, file: File): Promise<string> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(apiUrl(path), {
    method: 'POST',
    credentials: 'include',
    body: form,
  })
  const text = await res.text()
  let data: { url?: string; message?: string } = {}
  try {
    data = text ? (JSON.parse(text) as { url?: string; message?: string }) : {}
  } catch {
    data = { message: text }
  }
  if (!res.ok) {
    throw new Error(data.message || 'Görsel yüklenemedi')
  }
  return data.url!
}

/** İlan görselleri (e-posta doğrulaması gerekir). */
export function uploadImage(file: File): Promise<string> {
  return uploadMultipart('/api/media/images', file)
}

/** Profil fotoğrafı. */
export function uploadProfileImage(file: File): Promise<string> {
  return uploadMultipart('/api/media/profile-image', file)
}
