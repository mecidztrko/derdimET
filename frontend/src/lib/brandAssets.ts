/** Vite `base` (/auth/) ile uyumlu statik marka dosyaları (public/). */
export function brandLogoUrl(ext: 'png' | 'svg' | 'webp' = 'png'): string {
  const base = import.meta.env.BASE_URL
  return `${base}logo.${ext}`
}

export const BRAND_LOGO_FALLBACK = brandLogoUrl('svg')
