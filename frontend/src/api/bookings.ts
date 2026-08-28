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

export type RecurringBookingResponse = {
  recurrence_group_id: string
  count: number
  bookings: Array<{
    id: string
    start_time: string
    end_time: string
    status: string
  }>
}

export function createRecurringBooking(payload: {
  resource: string
  start_time: string
  end_time: string
  player_name: string
  player_email: string
  weeks: number
}): Promise<RecurringBookingResponse> {
  return apiRequest<RecurringBookingResponse>('/api/bookings/recurring/', {
    method: 'POST',
    body: payload,
  })
}
