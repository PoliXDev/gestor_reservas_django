import type { TimeSlot } from '../../api/types'
import { formatSlotRange } from '../../lib/dates'
import { TimeSlotPill } from './TimeSlotPill'

type SlotScheduleGridProps = {
  slots: TimeSlot[]
  selectedStart: string | null
  onSelect: (slot: TimeSlot) => void
}

function periodOf(startIso: string): 'morning' | 'afternoon' | 'evening' {
  const hour = new Date(startIso).getHours()
  if (hour < 13) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

const PERIOD_LABEL = {
  morning: 'Mañana',
  afternoon: 'Tarde',
  evening: 'Noche',
} as const

export function SlotScheduleGrid({ slots, selectedStart, onSelect }: SlotScheduleGridProps) {
  const available = slots.filter((s) => s.status === 'available').length
  const booked = slots.length - available

  const groups = {
    morning: slots.filter((s) => periodOf(s.start) === 'morning'),
    afternoon: slots.filter((s) => periodOf(s.start) === 'afternoon'),
    evening: slots.filter((s) => periodOf(s.start) === 'evening'),
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" aria-hidden />
          Libre ({available})
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" aria-hidden />
          Ocupado ({booked})
        </span>
      </div>

      {(Object.keys(groups) as Array<keyof typeof groups>).map((period) => {
        const periodSlots = groups[period]
        if (periodSlots.length === 0) return null
        return (
          <div key={period}>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {PERIOD_LABEL[period]}
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {periodSlots.map((slot) => (
                <TimeSlotPill
                  key={`${slot.start}-${slot.end}`}
                  slot={slot}
                  selected={selectedStart === slot.start}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        )
      })}

      {slots.length === 0 ? (
        <p className="text-sm text-slate-500">Sin horarios para este día.</p>
      ) : null}

      {selectedStart ? (
        <p className="text-sm text-emerald-700">
          Seleccionado:{' '}
          <span className="font-medium">
            {formatSlotRange(
              selectedStart,
              slots.find((s) => s.start === selectedStart)?.end ?? selectedStart,
            )}
          </span>
        </p>
      ) : null}
    </div>
  )
}
