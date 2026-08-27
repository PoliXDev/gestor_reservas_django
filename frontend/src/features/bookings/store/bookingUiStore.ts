import { create } from 'zustand'

import type { Court, TimeSlot } from '../../../api/types'
import type { Surface } from '../../../api/types'

type BookingUiState = {
  surfaceFilter: Surface | null
  selectedCourt: Court | null
  selectedDate: string
  selectedSlot: TimeSlot | null
  isModalOpen: boolean
  setSurfaceFilter: (surface: Surface | null) => void
  selectCourt: (court: Court) => void
  setSelectedDate: (date: string) => void
  openBooking: (slot: TimeSlot) => void
  closeModal: () => void
}

export const useBookingUiStore = create<BookingUiState>((set) => ({
  surfaceFilter: null,
  selectedCourt: null,
  selectedDate: '',
  selectedSlot: null,
  isModalOpen: false,
  setSurfaceFilter: (surface) => set({ surfaceFilter: surface }),
  selectCourt: (court) => set({ selectedCourt: court, selectedSlot: null, isModalOpen: false }),
  setSelectedDate: (date) => set({ selectedDate: date, selectedSlot: null, isModalOpen: false }),
  openBooking: (slot) => set({ selectedSlot: slot, isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false, selectedSlot: null }),
}))
