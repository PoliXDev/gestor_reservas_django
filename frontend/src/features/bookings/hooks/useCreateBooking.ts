import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createBooking,
  createRecurringBooking,
  type RecurringBookingResponse,
} from '../../../api/bookings'
import type { Booking } from '../../../api/types'

type CreateBookingInput = {
  resource: string
  start_time: string
  end_time: string
  player_name: string
  player_email: string
  weeks?: number
}

export function useCreateBooking() {
  const queryClient = useQueryClient()

  return useMutation<Booking | RecurringBookingResponse, Error, CreateBookingInput>({
    mutationFn: (input) => {
      if (input.weeks && input.weeks >= 2) {
        return createRecurringBooking({
          resource: input.resource,
          start_time: input.start_time,
          end_time: input.end_time,
          player_name: input.player_name,
          player_email: input.player_email,
          weeks: input.weeks,
        })
      }
      return createBooking(input)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['court-slots'] })
      void queryClient.invalidateQueries({ queryKey: ['agenda'] })
    },
  })
}
