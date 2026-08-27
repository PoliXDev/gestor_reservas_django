import { useEffect, useState } from 'react'

import type { Court, TimeSlot } from '../../api/types'
import { ApiError } from '../../api/client'
import { useCreateBooking } from '../../features/bookings/hooks/useCreateBooking'
import { formatLongDate, formatSlotRange } from '../../lib/dates'
import { surfaceLabel } from '../../lib/surfaces'
import { Badge } from '../ui/Badge'

type Step = 'player' | 'confirm' | 'success'

type PlayerForm = {
  fullName: string
  email: string
}

type BookingModalProps = {
  open: boolean
  court: Court | null
  slot: TimeSlot | null
  date: string
  onClose: () => void
}

const EMPTY_PLAYER: PlayerForm = { fullName: '', email: '' }

export function BookingModal({ open, court, slot, date, onClose }: BookingModalProps) {
  const mutation = useCreateBooking()
  const [step, setStep] = useState<Step>('player')
  const [player, setPlayer] = useState<PlayerForm>(EMPTY_PLAYER)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setStep('player')
    setPlayer(EMPTY_PLAYER)
    setFormError(null)
    mutation.reset()
  }, [open, slot?.start])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && step !== 'success') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, step])

  if (!open || !court || !slot) return null

  const mutationError =
    mutation.error instanceof ApiError
      ? mutation.error.message
      : mutation.error
        ? 'No se pudo crear la reserva.'
        : null

  function validatePlayer(): boolean {
    if (player.fullName.trim().length < 2) {
      setFormError('Introduce el nombre del jugador.')
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(player.email.trim())) {
      setFormError('Introduce un email válido.')
      return false
    }
    setFormError(null)
    return true
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      onClick={() => {
        if (step !== 'success') onClose()
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              {step === 'player' && 'Paso 1 · Datos del jugador'}
              {step === 'confirm' && 'Paso 2 · Confirmación'}
              {step === 'success' && 'Reserva confirmada'}
            </p>
            <h2 id="booking-modal-title" className="font-display text-xl font-semibold text-slate-900">
              {court.name}
            </h2>
          </div>
          <Badge tone={step === 'success' ? 'success' : 'action'}>
            {surfaceLabel(court.surface)}
          </Badge>
        </div>

        <div className="mb-4 flex gap-2" aria-hidden>
          <span className={`h-1 flex-1 rounded-full ${step === 'player' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
          <span
            className={`h-1 flex-1 rounded-full ${
              step === 'confirm' ? 'bg-amber-500' : step === 'success' ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          />
        </div>

        <dl className="mb-4 space-y-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Fecha</dt>
            <dd className="font-medium capitalize">{formatLongDate(date)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate-500">Horario</dt>
            <dd className="font-medium">{formatSlotRange(slot.start, slot.end)}</dd>
          </div>
          {step !== 'player' ? (
            <>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Jugador</dt>
                <dd className="font-medium">{player.fullName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Email</dt>
                <dd className="font-medium">{player.email}</dd>
              </div>
            </>
          ) : null}
        </dl>

        {step === 'player' ? (
          <form
            className="mb-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault()
              if (validatePlayer()) setStep('confirm')
            }}
          >
            <label className="block text-sm text-slate-600">
              Nombre completo
              <input
                autoFocus
                value={player.fullName}
                onChange={(event) => setPlayer((prev) => ({ ...prev, fullName: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="Ana García"
              />
            </label>
            <label className="block text-sm text-slate-600">
              Email
              <input
                type="email"
                value={player.email}
                onChange={(event) => setPlayer((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                placeholder="ana@email.com"
              />
            </label>
            {formError ? (
              <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
                {formError}
              </p>
            ) : null}
            <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
              >
                Continuar
              </button>
            </div>
          </form>
        ) : null}

        {step === 'confirm' ? (
          <div>
            {mutationError ? (
              <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
                {mutationError}
              </p>
            ) : null}
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setStep('player')}
                disabled={mutation.isPending}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                Atrás
              </button>
              <button
                type="button"
                disabled={mutation.isPending}
                onClick={() => {
                  mutation.mutate(
                    {
                      resource: court.id,
                      start_time: slot.start,
                      end_time: slot.end,
                      player_name: player.fullName.trim(),
                      player_email: player.email.trim(),
                    },
                    {
                      onSuccess: () => setStep('success'),
                    },
                  )
                }}
                className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-60"
              >
                {mutation.isPending ? 'Reservando…' : 'Confirmar reserva'}
              </button>
            </div>
          </div>
        ) : null}

        {step === 'success' ? (
          <div className="space-y-4">
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
              Tu pista quedó reservada. El horario ya aparece como ocupado en el calendario.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Listo
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
