/**
 * Ortak backend URL’si. Boş bırakılınca göreli yol kullanılır:
 * - `npm run dev` (Vite): proxy → Spring (vite.config.ts)
 * - `vite build` çıktısı Spring `static/auth` altında: `/api` → aynı origin (8080)
 * Uzak bir API’ye bağlanmak için: VITE_API_BASE_URL=http://192.168.1.10:8080
 */
export function apiUrl(path: string): string {
  const raw = import.meta.env.VITE_API_BASE_URL as string | undefined
  const base = typeof raw === 'string' ? raw.trim().replace(/\/$/, '') : ''
  const p = path.startsWith('/') ? path : `/${path}`
  return base ? `${base}${p}` : p
}
