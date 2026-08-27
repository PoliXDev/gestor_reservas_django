import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export function todayIso(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatSlotRange(startIso: string, endIso: string): string {
  const start = parseISO(startIso)
  const end = parseISO(endIso)
  return `${format(start, 'HH:mm')} – ${format(end, 'HH:mm')}`
}

export function formatLongDate(dateIso: string): string {
  return format(parseISO(`${dateIso}T12:00:00`), "EEEE d 'de' MMMM", { locale: es })
}
