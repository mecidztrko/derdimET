import type { AnimalCategoryFilter } from '../../lib/animalCategory'
import { ANIMAL_CATEGORY_LABELS } from '../../lib/animalCategory'

const OPTIONS: { key: AnimalCategoryFilter; label: string }[] = [
  { key: 'ALL', label: 'Tümü' },
  { key: 'KUCUKBAS', label: ANIMAL_CATEGORY_LABELS.KUCUKBAS },
  { key: 'BUYUKBAS', label: ANIMAL_CATEGORY_LABELS.BUYUKBAS },
]

type Props = {
  filter: AnimalCategoryFilter
  onChange: (f: AnimalCategoryFilter) => void
}

export function AnimalCategoryFilterBar({ filter, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {OPTIONS.map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => onChange(opt.key)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            filter === opt.key
              ? 'bg-clinical-600 text-white shadow-md'
              : 'border border-gray-200 bg-white text-gray-700 hover:border-clinical-200 hover:bg-clinical-50'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
