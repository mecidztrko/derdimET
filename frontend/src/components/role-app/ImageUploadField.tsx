import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { ApiError } from '../../api/client'
import { uploadImage } from '../../api/media'
import { useEmailVerificationGate } from '../../hooks/useEmailVerificationGate'
import { EMAIL_VERIFICATION_REQUIRED } from '../../lib/emailVerification'
import { Button } from './Button'
import { EmailVerificationNotice } from './EmailVerificationNotice'

type ImageUploadFieldProps = {
  urls: string[]
  onChange: (urls: string[]) => void
  max?: number
  label?: string
}

export function ImageUploadField({ urls, onChange, max = 3, label = 'Fotoğraflar' }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { blocked } = useEmailVerificationGate()

  async function onFilesSelected(files: FileList | null) {
    if (!files?.length) return
    if (blocked) {
      setError(EMAIL_VERIFICATION_REQUIRED)
      return
    }
    setUploading(true)
    setError(null)
    try {
      const next = [...urls]
      for (const file of Array.from(files)) {
        if (next.length >= max) break
        const url = await uploadImage(file)
        next.push(url)
      }
      onChange(next)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : e instanceof Error ? e.message : 'Yükleme başarısız')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div>
      <label className="text-small font-medium mb-2 block">{label}</label>
      {blocked ? <EmailVerificationNotice className="mb-2" /> : null}
      {error ? <p className="text-caption text-destructive mb-2">{error}</p> : null}
      <div className="flex flex-wrap gap-2 mb-2">
        {urls.map((url) => (
          <div key={url} className="relative size-20 rounded-lg overflow-hidden border border-border">
            <img src={url} alt="" className="size-full object-cover" />
            <button
              type="button"
              className="absolute top-1 right-1 size-6 rounded-full bg-black/60 flex items-center justify-center text-white"
              onClick={() => onChange(urls.filter((u) => u !== url))}
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
      </div>
      {urls.length < max && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={(e) => void onFilesSelected(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading || blocked}
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="size-4 mr-2" />
            {uploading ? 'Yükleniyor…' : 'Fotoğraf ekle'}
          </Button>
        </>
      )}
    </div>
  )
}
