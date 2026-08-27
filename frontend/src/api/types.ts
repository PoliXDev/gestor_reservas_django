export type Surface = 'CLAY' | 'GRASS' | 'HARD'

export type Court = {
  id: string
  name: string
  resource_type: string
  surface: Surface | null
  capacity: number
  image_url: string
  description: string
  is_active: boolean
}

export type SlotStatus = 'available' | 'booked'

export type TimeSlot = {
  start: string
  end: string
  status: SlotStatus
  booking_id: string | null
}

export type CourtSlotsResponse = {
  court_id: string
  date: string
  slots: TimeSlot[]
}

export type Booking = {
  id: string
  resource: string
  start_time: string
  end_time: string
  status: string
  recurrence_group_id: string | null
  player_name: string
  player_email: string
  created_at: string
  updated_at: string
}

export type ApiErrorBody = {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}
