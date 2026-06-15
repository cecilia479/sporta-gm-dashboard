'use client'
import { BLIND_SPOTS, CULTURA_SIGNALS } from '@/data/content'

export default function BlindSpotsTab() {
  return (
    <div>
      <div className="mb-8">
        <p className="section-header">Revisa esta sección una vez por mes</p>
        <h1 className="text-2xl font-semibold text-navy">Puntos ciegos y señales de cultura</h1>
      </div>

      {/* Blind spots */}
      <h2 className="font-semibold text-navy mb-4">Mis posibles puntos ciegos como GM</h2>
      <div className="space-y-3 mb-10">
        {BLIND_SPOTS.map((b, i) => (
          <div key={i} className="card flex gap-4">
            <div className="w-8 h-8 rounded-full bg-amber-light text-amber text-sm font-bold flex items-center justify-center flex-shrink-0 mt-0.5">!</div>
            <div>
              <p className="font-medium text-navy text-sm mb-1">{b.titulo}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Culture signals */}
      <h2 className="font-semibold text-navy mb-4">Señales de cultura — diagnóstico</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-10">
        <div className="card border-danger/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-danger-light text-danger text-sm flex items-center justify-center font-bold">⚠</span>
            <h3 className="font-semibold text-danger">Señales de cultura débil</h3>
          </div>
          <ul className="space-y-2">
            {CULTURA_SIGNALS.debil.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600 pb-2 border-b border-slate-100 last:border-0">
                <span className="text-danger flex-shrink-0 mt-0.5">✗</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="card border-accent/20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-accent-light text-accent text-sm flex items-center justify-center font-bold">✓</span>
            <h3 className="font-semibold text-accent">Señales de alto desempeño</h3>
          </div>
          <ul className="space-y-2">
            {CULTURA_SIGNALS.fuerte.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-600 pb-2 border-b border-slate-100 last:border-0">
                <span className="text-accent flex-shrink-0 mt-0.5">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Common CEO mistakes in fitness */}
      <h2 className="font-semibold text-navy mb-4">Errores comunes de CEOs en gimnasios y clubes deportivos</h2>
      <div className="card">
        {[
          { error: 'Gestionar por ocupación, no por rentabilidad', detalle: 'Una clase llena que no cubre su costo variable es peor que una clase vacía. Conoce el margen por servicio.' },
          { error: 'Subestimar la importancia de los instructores estrella', detalle: 'Un instructor que se va puede llevarse hasta el 30% de sus alumnos. Son activos relacionales, no operativos.' },
          { error: 'Confundir retención con satisfacción', detalle: 'Un miembro satisfecho que no viene se cancela igual. El comportamiento importa más que la opinión.' },
          { error: 'Innovar en producto antes de dominar operaciones básicas', detalle: 'Abrir una nueva academia antes de que las existentes sean rentables multiplica los problemas, no el crecimiento.' },
          { error: 'No tener precio diferenciado por demanda y horario', detalle: 'Cobrar lo mismo en hora pico que en hora muerta es dejar dinero en la mesa y subutilizar capacidad.' },
        ].map((e, i) => (
          <div key={i} className="pb-4 mb-4 border-b border-slate-100 last:border-0 last:mb-0 last:pb-0">
            <p className="text-sm font-semibold text-navy mb-1">{i + 1}. {e.error}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{e.detalle}</p>
          </div>
        ))}
      </div>

      {/* Weekly reflection */}
      <div className="mt-8 bg-navy rounded-2xl p-6">
        <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">Pregunta de cierre · Cada viernes</p>
        <p className="text-white text-lg font-medium leading-relaxed italic">
          "Si un observador externo revisara todo lo que hice esta semana, ¿concluiría que soy una GM estratégica o una administradora reactiva?"
        </p>
      </div>
    </div>
  )
}
