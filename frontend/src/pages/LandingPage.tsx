import type { AppView } from '../app/types'
import { Navbar } from '../components/ui/Navbar'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=2000&q=80'

type LandingPageProps = {
  onNavigate: (view: AppView) => void
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <section className="relative isolate min-h-[100svh] overflow-hidden bg-slate-950">
        <Navbar current="landing" onNavigate={onNavigate} variant="overHero" />

        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <img
            src={HERO_IMAGE}
            alt=""
            className="landing-hero-image h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/25" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-16 pt-28 sm:px-6 sm:pb-24">
          <div className="landing-hero-copy max-w-2xl">
            <p className="font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Club de Tenis
            </p>
            <h1 className="mt-3 max-w-xl text-lg font-medium text-white/90 sm:text-2xl">
              Reserva tu pista en minutos
            </h1>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
            ¡Prepara tu raqueta y reserva tu espacio en nuestras canchas de tenis y mini tenis, para disfrutar de una experiencia deportiva inolvidable! 
            </p>
            <div className="mt-8">
              <button
                type="button"
                onClick={() => onNavigate('courts')}
                className="rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                Reservar pista
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
