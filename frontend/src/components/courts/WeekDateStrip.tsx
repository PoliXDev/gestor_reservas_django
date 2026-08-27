import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

type WeekDateStripProps = {
  value: string
  onChange: (date: string) => void
  days?: number
}

export function WeekDateStrip({ value, onChange, days = 7 }: WeekDateStripProps) {
  const base = parseISO(`${format(new Date(), 'yyyy-MM-dd')}T12:00:00`)

  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="listbox" aria-label="Días de la semana">
      {Array.from({ length: days }, (_, index) => {
        const day = new Date(base)
        day.setDate(base.getDate() + index)
        const iso = format(day, 'yyyy-MM-dd')
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
  )
}
