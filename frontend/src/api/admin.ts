import { apiRequest } from './client'
import type { Surface } from './types'

export type AgendaBooking = {
  id: string
  start_time: string
  end_time: string
  status: string
  player_name: string
  player_email: string
}

export type AgendaCourt = {
  id: string
  name: string
  surface: Surface | null
  bookings: AgendaBooking[]
}

export type AgendaResponse = {
  date: string
  courts: AgendaCourt[]
}

export function fetchAgenda(date: string): Promise<AgendaResponse> {
  return apiRequest<AgendaResponse>(`/api/agenda/?date=${encodeURIComponent(date)}`)
}

export function cancelBooking(bookingId: string): Promise<{ id: string; status: string }> {
  return apiRequest(`/api/bookings/${bookingId}/cancel/`, {
    method: 'POST',
  })
}
