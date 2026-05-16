export type AnimalCategory = 'KUCUKBAS' | 'BUYUKBAS'

export type AnimalCategoryFilter = 'ALL' | AnimalCategory

export const ANIMAL_CATEGORY_LABELS: Record<AnimalCategory, string> = {
  KUCUKBAS: 'Küçükbaş',
  BUYUKBAS: 'Büyükbaş',
}

const STORAGE_KEY = 'derdimet_animal_category_filter'

export function labelForAnimalCategory(c: AnimalCategory | null | undefined): string {
  if (!c) return '—'
  return ANIMAL_CATEGORY_LABELS[c] ?? c
}

export function matchesAnimalCategoryFilter(
  category: AnimalCategory | null | undefined,
  filter: AnimalCategoryFilter,
): boolean {
  if (filter === 'ALL') return true
  if (category == null) return false
  return category === filter
}

export function readAnimalCategoryFilter(): AnimalCategoryFilter {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v === 'KUCUKBAS' || v === 'BUYUKBAS') return v
  } catch {
    /* ignore */
  }
  return 'ALL'
}

export function writeAnimalCategoryFilter(filter: AnimalCategoryFilter): void {
  try {
    localStorage.setItem(STORAGE_KEY, filter)
  } catch {
    /* ignore */
  }
}
