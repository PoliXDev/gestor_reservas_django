import type { TimeSlot } from '../../api/types'
import { formatSlotRange } from '../../lib/dates'

type TimeSlotPillProps = {
  slot: TimeSlot
  selected?: boolean
  onSelect: (slot: TimeSlot) => void
}

export function TimeSlotPill({ slot, selected = false, onSelect }: TimeSlotPillProps) {
  const available = slot.status === 'available'
  const label = formatSlotRange(slot.start, slot.end)

  if (!available) {
    return (
      <span
        className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-2.5 text-sm text-slate-400 line-through"
        title="Ocupado"
      >
        {label}
      </span>
    )
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(slot)}
      className={
        selected
          ? 'inline-flex w-full items-center justify-center rounded-lg border-2 border-amber-500 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-900 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500'
          : 'inline-flex w-full items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-800 transition hover:border-emerald-400 hover:bg-emerald-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
      }
    >
      {label}
    </button>
  )
}
