import { useCallback, useEffect, useState } from 'react'
import type { AnimalCategoryFilter } from '../lib/animalCategory'
import { readAnimalCategoryFilter, writeAnimalCategoryFilter } from '../lib/animalCategory'

export function useAnimalCategoryFilter() {
  const [filter, setFilterState] = useState<AnimalCategoryFilter>(() => readAnimalCategoryFilter())

  useEffect(() => {
    setFilterState(readAnimalCategoryFilter())
  }, [])

  const setFilter = useCallback((f: AnimalCategoryFilter) => {
    setFilterState(f)
    writeAnimalCategoryFilter(f)
  }, [])

  return { filter, setFilter }
}
