import type { AppView } from '../../app/types'

type NavbarProps = {
  current?: AppView
  onNavigate?: (view: AppView) => void
  variant?: 'solid' | 'overHero'
}

export function Navbar({ current = 'landing', onNavigate, variant = 'solid' }: NavbarProps) {
  const overHero = variant === 'overHero'

  return (
    <header className={overHero ? 'absolute inset-x-0 top-0 z-20 bg-transparent' : 'relative z-20 bg-transparent'}>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-1 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate?.('landing')}
          className="flex items-center"
          aria-label="Club de Tenis — inicio"
          aria-current={current === 'landing' ? 'page' : undefined}
        >
          <img
            src="/tennis-logo.png"
            alt="Club de Tenis"
            className="h-[10.5rem] w-[10.5rem] object-contain"
            width={168}
            height={168}
          />
        </button>

        <nav className="flex items-center gap-2" aria-label="Principal">
          <button
            type="button"
            onClick={() => onNavigate?.('courts')}
            aria-current={current === 'courts' ? 'page' : undefined}
            className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Reservar
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.('admin')}
            aria-current={current === 'admin' ? 'page' : undefined}
            className={
              overHero
                ? current === 'admin'
                  ? 'rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium text-white'
                  : 'rounded-lg px-3 py-1.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white'
                : current === 'admin'
                  ? 'rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-900'
                  : 'rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100'
            }
          >
            Admin
          </button>
        </nav>
      </div>
    </header>
  )
}
