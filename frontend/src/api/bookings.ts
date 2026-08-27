import { apiRequest } from './client'
import type { Booking } from './types'

export function createBooking(payload: {
  resource: string
  start_time: string
  end_time: string
  player_name: string
  player_email: string
}): Promise<Booking> {
  return apiRequest<Booking>('/api/bookings/', {
    method: 'POST',
    body: payload,
  })
}
