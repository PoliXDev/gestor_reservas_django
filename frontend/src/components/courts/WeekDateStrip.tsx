import { useEffect, useMemo, useState } from 'react'
import { addDays, format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

type WeekDateStripProps = {
  value: string
  onChange: (date: string) => void
  days?: number
}

const MAX_WEEK_OFFSET = 7

function todayAtNoon(): Date {
  return parseISO(`${format(new Date(), 'yyyy-MM-dd')}T12:00:00`)
}

function visibleDayIsos(weekOffset: number, count: number): string[] {
  const base = addDays(todayAtNoon(), weekOffset * count)
  return Array.from({ length: count }, (_, index) =>
    format(addDays(base, index), 'yyyy-MM-dd'),
  )
}

export function WeekDateStrip({ value, onChange, days = 7 }: WeekDateStripProps) {
  const [weekOffset, setWeekOffset] = useState(0)
  const visibleDays = useMemo(() => visibleDayIsos(weekOffset, days), [weekOffset, days])
  const base = addDays(todayAtNoon(), weekOffset * days)

  useEffect(() => {
    if (!visibleDays.includes(value)) {
      onChange(visibleDays[0])
    }
  }, [weekOffset, days, onChange, value, visibleDays])

  const rangeLabel = `${format(base, 'd MMM', { locale: es })} – ${format(
    addDays(base, days - 1),
    'd MMM',
    { locale: es },
  )}`

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={weekOffset === 0}
          onClick={() => setWeekOffset((offset) => Math.max(0, offset - 1))}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ‹ Anterior
        </button>
        <p className="text-xs capitalize text-slate-500">{rangeLabel}</p>
        <button
          type="button"
          disabled={weekOffset >= MAX_WEEK_OFFSET}
          onClick={() => setWeekOffset((offset) => Math.min(MAX_WEEK_OFFSET, offset + 1))}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente ›
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="listbox" aria-label="Días disponibles">
        {visibleDays.map((iso, index) => {
          const day = addDays(base, index)
          const active = iso === value
          return (
            <button
              key={iso}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => onChange(iso)}
              className={
                active
                  ? 'min-w-[4.5rem] shrink-0 rounded-xl bg-emerald-600 px-3 py-2 text-center text-white shadow-sm transition'
                  : 'min-w-[4.5rem] shrink-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-center text-slate-700 transition hover:border-emerald-300'
              }
            >
              <span className="block text-[11px] font-medium uppercase opacity-80">
                {format(day, 'EEE', { locale: es })}
              </span>
              <span className="block font-display text-lg font-semibold leading-tight">
                {format(day, 'd')}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
