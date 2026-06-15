'use client'
import { START_STOP_CONTINUE } from '@/data/content'

export default function StartStopTab() {
  const { start, stop, continue: cont, evitar } = START_STOP_CONTINUE

  return (
    <div>
      <div className="mb-8">
        <p className="section-header">Hoja de referencia semanal · Léela cada lunes</p>
        <h1 className="text-2xl font-semibold text-navy">Start · Stop · Continue</h1>
      </div>

      {/* Three columns */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="card border-accent/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">▲</span>
            <h2 className="font-semibold text-accent">Empezar a hacer</h2>
          </div>
          <ul className="space-y-2">
            {start.map((item, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-2 pb-2 border-b border-slate-100 last:border-0">
                <span className="text-accent flex-shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="card border-danger/30">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-danger text-white text-xs font-bold flex items-center justify-center">✕</span>
            <h2 className="font-semibold text-danger">Dejar de hacer</h2>
          </div>
          <ul className="space-y-2">
            {stop.map((item, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-2 pb-2 border-b border-slate-100 last:border-0">
                <span className="text-danger flex-shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="card border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">●</span>
            <h2 className="font-semibold text-blue-700">Seguir haciendo</h2>
          </div>
          <ul className="space-y-2">
            {cont.map((item, i) => (
              <li key={i} className="text-sm text-slate-600 flex gap-2 pb-2 border-b border-slate-100 last:border-0">
                <span className="text-blue-400 flex-shrink-0">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Decisions to stop avoiding */}
      <div className="card">
        <h2 className="font-semibold text-navy mb-1">Decisiones que probablemente estás evitando</h2>
        <p className="text-sm text-slate-400 mb-5">Cada una tiene costo real aunque sea invisible.</p>
        <div className="space-y-4">
          {evitar.map((e, i) => (
            <div key={i} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
              <div className="w-2 h-2 rounded-full bg-danger flex-shrink-0 mt-2" />
              <div>
                <p className="text-sm font-semibold text-navy mb-1">{e.decision}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{e.razon}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delegate section */}
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="card border-amber/30">
          <h2 className="font-semibold text-amber mb-3">Delegar más</h2>
          {['Coordinación operativa diaria de academias', 'Seguimiento de tareas de mantenimiento', 'Comunicaciones internas de rutina', 'Reportes administrativos de bajo nivel'].map((d, i) => (
            <p key={i} className="text-sm text-slate-600 py-2 border-b border-slate-100 last:border-0">→ {d}</p>
          ))}
        </div>
        <div className="card border-slate-200">
          <h2 className="font-semibold text-navy mb-3">No delegar</h2>
          {['Definición de prioridades estratégicas', 'Conversaciones de desempeño críticas', 'Relación con los mejores clientes', 'Decisiones de cultura y estándares'].map((d, i) => (
            <p key={i} className="text-sm text-slate-600 py-2 border-b border-slate-100 last:border-0">→ {d}</p>
          ))}
        </div>
      </div>
    </div>
  )
}
