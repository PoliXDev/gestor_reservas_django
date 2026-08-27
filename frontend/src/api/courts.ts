import { apiRequest } from './client'
import type { Court, CourtSlotsResponse, Surface } from './types'

export function fetchCourts(surface?: Surface | null): Promise<Court[]> {
  const query = surface ? `?surface=${surface}` : ''
  return apiRequest<Court[]>(`/api/courts/${query}`)
}

export function fetchCourtSlots(courtId: string, date: string): Promise<CourtSlotsResponse> {
  return apiRequest<CourtSlotsResponse>(
    `/api/courts/${courtId}/slots/?date=${encodeURIComponent(date)}`,
  )
}
