import { useEffect } from 'react'

import { BookingModal } from '../components/bookings/BookingModal'
import { CourtCard } from '../components/courts/CourtCard'
import { SlotScheduleGrid } from '../components/courts/SlotScheduleGrid'
import { SurfaceFilter } from '../components/courts/SurfaceFilter'
import { WeekDateStrip } from '../components/courts/WeekDateStrip'
import { Navbar } from '../components/ui/Navbar'
import type { AppView } from '../app/types'
import { useBookingUiStore } from '../features/bookings/store/bookingUiStore'
import { useCourtSlots } from '../features/courts/hooks/useCourtSlots'
import { useCourts } from '../features/courts/hooks/useCourts'
import { formatLongDate, todayIso } from '../lib/dates'

type CourtsPageProps = {
  onNavigate: (view: AppView) => void
}

export function CourtsPage({ onNavigate }: CourtsPageProps) {
  const surfaceFilter = useBookingUiStore((s) => s.surfaceFilter)
  const selectedCourt = useBookingUiStore((s) => s.selectedCourt)
  const selectedDate = useBookingUiStore((s) => s.selectedDate)
  const selectedSlot = useBookingUiStore((s) => s.selectedSlot)
  const isModalOpen = useBookingUiStore((s) => s.isModalOpen)
  const setSurfaceFilter = useBookingUiStore((s) => s.setSurfaceFilter)
  const selectCourt = useBookingUiStore((s) => s.selectCourt)
  const setSelectedDate = useBookingUiStore((s) => s.setSelectedDate)
  const openBooking = useBookingUiStore((s) => s.openBooking)
  const closeModal = useBookingUiStore((s) => s.closeModal)

  useEffect(() => {
    if (!selectedDate) {
      setSelectedDate(todayIso())
    }
  }, [selectedDate, setSelectedDate])

  const courtsQuery = useCourts(surfaceFilter)
  const slotsQuery = useCourtSlots(selectedCourt?.id ?? null, selectedDate || todayIso())

  useEffect(() => {
    if (!selectedCourt && courtsQuery.data && courtsQuery.data.length > 0) {
      selectCourt(courtsQuery.data[0])
    }
  }, [courtsQuery.data, selectedCourt, selectCourt])

  useEffect(() => {
    if (
      selectedCourt &&
      courtsQuery.data &&
      !courtsQuery.data.some((court) => court.id === selectedCourt.id)
    ) {
      if (courtsQuery.data[0]) {
        selectCourt(courtsQuery.data[0])
      }
    }
  }, [courtsQuery.data, selectedCourt, selectCourt])

  const dateValue = selectedDate || todayIso()

  return (
    <div className="page-cream-bg min-h-screen">
      <Navbar current="courts" onNavigate={onNavigate} />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="mb-8 max-w-2xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Reserva tu pista
          </h1>
          <p className="mt-2 text-slate-600">
            Elige día, pista y horario.
          </p>
        </section>

        <section className="mb-6 space-y-3">
          <h2 className="text-sm font-medium text-slate-700">Superficie</h2>
          <SurfaceFilter value={surfaceFilter} onChange={setSurfaceFilter} />
        </section>

        <section className="mb-8 space-y-3">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-sm font-medium text-slate-700">Calendario</h2>
            <p className="text-sm capitalize text-slate-500">{formatLongDate(dateValue)}</p>
          </div>
          <WeekDateStrip value={dateValue} onChange={setSelectedDate} />
        </section>

        <section className="mb-10">
          {courtsQuery.isLoading ? (
            <p className="text-sm text-slate-500">Cargando pistas…</p>
          ) : courtsQuery.isError ? (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
              No se pudieron cargar las pistas. ¿Está el backend en marcha?
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {courtsQuery.data?.map((court) => (
                <CourtCard
                  key={court.id}
                  court={court}
                  selected={selectedCourt?.id === court.id}
                  onSelect={selectCourt}
                />
              ))}
            </div>
          )}
        </section>

        {selectedCourt ? (
          <section className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm">
            <div className="mb-5">
              <h2 className="font-display text-xl font-semibold text-slate-900">
                Horarios · {selectedCourt.name}
              </h2>
              <p className="text-sm text-slate-500">
                Pulsa un hueco libre para continuar con la reserva.
              </p>
            </div>

            {slotsQuery.isLoading ? (
              <p className="text-sm text-slate-500">Cargando huecos…</p>
            ) : slotsQuery.isError ? (
              <p className="text-sm text-rose-700" role="alert">
                No se pudieron cargar los horarios.
              </p>
            ) : slotsQuery.isFetching && !slotsQuery.isLoading ? (
              <div className="space-y-3">
                <p className="text-xs text-emerald-700">Actualizando disponibilidad…</p>
                <SlotScheduleGrid
                  slots={slotsQuery.data?.slots ?? []}
                  selectedStart={selectedSlot?.start ?? null}
                  onSelect={openBooking}
                />
              </div>
            ) : (
              <SlotScheduleGrid
                slots={slotsQuery.data?.slots ?? []}
                selectedStart={selectedSlot?.start ?? null}
                onSelect={openBooking}
              />
            )}
          </section>
        ) : null}
      </main>

      <BookingModal
        open={isModalOpen}
        court={selectedCourt}
        slot={selectedSlot}
        date={dateValue}
        onClose={closeModal}
      />
    </div>
  )
}
