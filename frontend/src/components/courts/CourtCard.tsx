import type { Court } from '../../api/types'
import { surfaceLabel } from '../../lib/surfaces'
import { Badge } from '../ui/Badge'

type CourtCardProps = {
  court: Court
  selected: boolean
  onSelect: (court: Court) => void
}

export function CourtCard({ court, selected, onSelect }: CourtCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(court)}
      className={
        selected
          ? 'group w-full overflow-hidden rounded-2xl border-2 border-emerald-600 bg-white text-left shadow-md shadow-emerald-600/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
          : 'group w-full overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:border-emerald-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
      }
    >
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        {court.image_url ? (
          <img
            src={court.image_url}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">
            Sin imagen
          </div>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-semibold text-slate-900">{court.name}</h3>
          <Badge tone={selected ? 'success' : 'neutral'}>{surfaceLabel(court.surface)}</Badge>
        </div>
        <p className="line-clamp-2 text-sm text-slate-600">
          {court.description || 'Pista disponible para reserva.'}
        </p>
        <p className="text-xs text-slate-500">Capacidad {court.capacity} jugadores</p>
      </div>
    </button>
  )
}
