import { useQuery } from '@tanstack/react-query'

import { fetchCourtSlots } from '../../../api/courts'

export function useCourtSlots(courtId: string | null, date: string) {
  return useQuery({
    queryKey: ['court-slots', courtId, date],
    queryFn: () => fetchCourtSlots(courtId!, date),
    enabled: Boolean(courtId),
  })
}
