type BadgeTone = 'success' | 'action' | 'neutral'

const TONE_CLASS: Record<BadgeTone, string> = {
  success: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  action: 'bg-amber-100 text-amber-900 ring-amber-200',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-200',
}

type BadgeProps = {
  children: React.ReactNode
  tone?: BadgeTone
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TONE_CLASS[tone]}`}
    >
      {children}
    </span>
  )
}
