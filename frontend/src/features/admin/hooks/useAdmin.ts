import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { cancelBooking, fetchAgenda } from '../../../api/admin'

export function useAgenda(date: string) {
  return useQuery({
    queryKey: ['agenda', date],
    queryFn: () => fetchAgenda(date),
    enabled: Boolean(date),
  })
}

export function useCancelBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (bookingId: string) => cancelBooking(bookingId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['agenda'] })
      void queryClient.invalidateQueries({ queryKey: ['court-slots'] })
    },
  })
}
