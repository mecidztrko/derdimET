import type { MeatSaleRequestDto } from '../api/types'

export function filterMeatListings(
  items: MeatSaleRequestDto[],
  opts: {
    search?: string
    meatType?: string
    animalCategory?: string
    city?: string
    favoritedOnly?: boolean
  },
): MeatSaleRequestDto[] {
  return items.filter((item) => {
    if (opts.favoritedOnly && !item.isFavoritedByMe) return false
    if (opts.meatType && opts.meatType !== 'Tümü') {
      const mt = (item.meatType ?? '').toLowerCase()
      if (!mt.includes(opts.meatType.toLowerCase())) return false
    }
    if (opts.animalCategory && opts.animalCategory !== 'Tüm Kategoriler') {
      const want = opts.animalCategory === 'Küçükbaş' ? 'KUCUKBAS' : 'BUYUKBAS'
      if (item.animalCategory !== want) return false
    }
    if (opts.city && opts.city !== 'Tüm Şehirler') {
      const city = item.slaughterhouseCity ?? item.location ?? ''
      if (!city.includes(opts.city)) return false
    }
    if (opts.search?.trim()) {
      const q = opts.search.trim().toLowerCase()
      const hay = [
        item.title,
        item.meatType,
        item.slaughterhouseName,
        item.slaughterhouseCompanyName,
        item.slaughterhouseCity,
        item.location,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}
