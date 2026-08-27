import { useQuery } from '@tanstack/react-query'

import { fetchCourts } from '../../../api/courts'
import type { Surface } from '../../../api/types'

export function useCourts(surface: Surface | null) {
  return useQuery({
    queryKey: ['courts', surface],
    queryFn: () => fetchCourts(surface),
  })
}
