import { useState } from 'react'

import type { AppView } from '../app/types'
import { ApiError } from '../api/client'
import { WeekDateStrip } from '../components/courts/WeekDateStrip'
import { surfaceLabel } from '../lib/surfaces'
import { Badge } from '../components/ui/Badge'
import { Navbar } from '../components/ui/Navbar'
import { useAgenda, useCancelBooking } from '../features/admin/hooks/useAdmin'
import { formatLongDate, formatSlotRange, todayIso } from '../lib/dates'

type AdminPageProps = {
  onNavigate: (view: AppView) => void
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [date, setDate] = useState(todayIso())
  const [message, setMessage] = useState<string | null>(null)
  const agendaQuery = useAgenda(date)
  const cancelMutation = useCancelBooking()

  const totalBookings =
    agendaQuery.data?.courts.reduce((acc, court) => acc + court.bookings.length, 0) ?? 0

  return (
    <div className="page-cream-bg min-h-screen">
      <Navbar
        current="admin"
        onNavigate={onNavigate}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="mb-8">
          <div className="max-w-xl">
            <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">
              Agenda del día
            </h1>
            <p className="mt-2 text-slate-600">
              Vista de todas las reservas.
            </p>
          </div>
        </section>

        <section className="mb-6 space-y-3">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-sm font-medium text-slate-700">Fecha</h2>
            <p className="text-sm capitalize text-slate-500">{formatLongDate(date)}</p>
          </div>
          <WeekDateStrip value={date} onChange={setDate} />
        </section>

        {message ? (
          <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
            {message}
          </p>
        ) : null}

        <p className="mb-4 text-sm text-slate-600">
          Reservas confirmadas este día: <span className="font-semibold">{totalBookings}</span>
        </p>

        {agendaQuery.isLoading ? (
          <p className="text-sm text-slate-500">Cargando agenda…</p>
        ) : agendaQuery.isError ? (
          <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
            No se pudo cargar la agenda.
          </p>
        ) : (
          <div className="space-y-4">
            {agendaQuery.data?.courts.map((court) => (
              <section
                key={court.id}
                className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-slate-900">{court.name}</h3>
                  <Badge tone="neutral">{surfaceLabel(court.surface)}</Badge>
                </div>

                {court.bookings.length === 0 ? (
                  <p className="text-sm text-slate-500">Sin reservas confirmadas.</p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {court.bookings.map((booking) => (
                      <li
                        key={booking.id}
                        className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {booking.player_name || 'Sin nombre'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatSlotRange(booking.start_time, booking.end_time)}
                            {booking.player_email ? ` · ${booking.player_email}` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          disabled={cancelMutation.isPending}
                          onClick={() => {
                            cancelMutation.mutate(booking.id, {
                              onSuccess: () => setMessage('Reserva cancelada.'),
                              onError: (error) => {
                                setMessage(
                                  error instanceof ApiError
                                    ? error.message
                                    : 'No se pudo cancelar la reserva.',
                                )
                              },
                            })
                          }}
                          className="rounded-lg border border-rose-200 px-3 py-1.5 text-sm font-medium text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                        >
                          Cancelar
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
