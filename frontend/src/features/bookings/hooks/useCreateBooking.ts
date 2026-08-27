import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createBooking } from '../../../api/bookings'

type CreateBookingInput = {
  resource: string
  start_time: string
  end_time: string
  player_name: string
  player_email: string
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateBookingInput) => createBooking(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['court-slots'] })
      void queryClient.invalidateQueries({ queryKey: ['agenda'] })
    },
  })
}
