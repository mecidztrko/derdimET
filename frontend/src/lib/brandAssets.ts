/** Vite `base` (/auth/) ile uyumlu statik marka dosyaları (public/). */
export function brandLogoUrl(ext: 'svg' | 'png' | 'webp' = 'svg'): string {
  const base = import.meta.env.BASE_URL
  return `${base}logo.${ext}`
}
