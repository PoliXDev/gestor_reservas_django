import type { Surface } from '../../api/types'
import { SURFACE_LABELS } from '../../lib/surfaces'

const OPTIONS: Array<{ value: Surface | null; label: string }> = [
  { value: null, label: 'Todas' },
  { value: 'CLAY', label: SURFACE_LABELS.CLAY },
  { value: 'GRASS', label: SURFACE_LABELS.GRASS },
  { value: 'HARD', label: SURFACE_LABELS.HARD },
]

type SurfaceFilterProps = {
  value: Surface | null
  onChange: (value: Surface | null) => void
}

export function SurfaceFilter({ value, onChange }: SurfaceFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por superficie">
      {OPTIONS.map((option) => {
        const active = value === option.value
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={
              active
                ? 'rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
                : 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
            }
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
