'use client'
import { useState } from 'react'
import { ROUTINE } from '@/data/content'

const CAT_COLORS: Record<string, string> = {
  Estrategia: 'bg-blue-50 text-blue-700',
  Personas: 'bg-accent-light text-accent',
  Operaciones: 'bg-amber-light text-amber',
  Clientes: 'bg-purple-50 text-purple-700',
  Reflexión: 'bg-slate-100 text-slate-600',
}

const MEETING = [
  { bloque: 'Check-in', tiempo: '5 min', contenido: '¿Cuál fue la victoria más importante del equipo la semana pasada? Cada líder comparte en 30 segundos.' },
  { bloque: 'KPIs', tiempo: '15 min', contenido: 'Solo KPIs rojos o amarillos. ¿Cuál es la causa raíz? ¿Quién es responsable? ¿Qué acción concreta antes del próximo lunes?' },
  { bloque: 'Temas escalados', tiempo: '20 min', contenido: 'Máximo 2 temas que los líderes traen preparados y necesitan decisión del grupo. Cada tema = 10 min.' },
  { bloque: 'Compromisos', tiempo: '15 min', contenido: '¿Qué comprometió cada persona la semana pasada? Estado: cumplido / no cumplido + razón. Nuevos compromisos.' },
  { bloque: 'Cierre', tiempo: '5 min', contenido: 'Una cosa que cada líder hará diferente esta semana. GM comparte el foco de la semana para alineación.' },
]

export default function RutinaTab() {
  const days = Object.keys(ROUTINE) as Array<keyof typeof ROUTINE>
  const todayName = new Date().toLocaleDateString('es-GT', { weekday: 'long' })
  const match = days.find(d => d.toLowerCase() === todayName.toLowerCase())
  const [activeDay, setActiveDay] = useState<string>(match || days[0])
  const [showMeeting, setShowMeeting] = useState(false)

  const day = ROUTINE[activeDay as keyof typeof ROUTINE]

  return (
    <div>
      <div className="mb-8">
        <p className="section-header">Regla de oro: 60% estrategia + personas · 25% operaciones · 15% desarrollo</p>
        <h1 className="text-2xl font-semibold text-navy">Rutina semanal ideal</h1>
      </div>

      {/* Time allocation */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { pct: '60%', label: 'Estrategia + personas', color: 'text-navy bg-navy/5' },
          { pct: '25%', label: 'Operaciones críticas', color: 'text-amber bg-amber-light' },
          { pct: '15%', label: 'Desarrollo personal', color: 'text-accent bg-accent-light' },
        ].map(({ pct, label, color }) => (
          <div key={pct} className={`card-sm text-center ${color}`}>
            <p className="text-2xl font-bold">{pct}</p>
            <p className="text-xs mt-1 opacity-80">{label}</p>
          </div>
        ))}
      </div>

      {/* Day selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {days.map(d => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              activeDay === d
                ? 'bg-navy text-white border-navy'
                : 'bg-white text-slate-600 border-border hover:border-navy/30'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Day schedule */}
      {day && (
        <div className="card mb-6">
          <h2 className="font-semibold text-navy mb-1">{activeDay}</h2>
          <p className="text-sm text-slate-400 mb-5">{day.subtitle}</p>
          <div className="space-y-3">
            {day.blocks.map((b, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-xs font-mono text-slate-400 flex-shrink-0 pt-0.5 w-20">{b.time}</span>
                <div className="flex-1 pb-3 border-b border-slate-100 last:border-0">
                  <p className="text-sm text-navy leading-relaxed">{b.task}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 font-medium ${CAT_COLORS[b.cat] || 'bg-slate-100 text-slate-500'}`}>
                  {b.cat}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meeting structure toggle */}
      <button
        onClick={() => setShowMeeting(!showMeeting)}
        className="w-full card text-left hover:border-navy/30 transition-all"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-navy">Reunión semanal de liderazgo</p>
            <p className="text-sm text-slate-400 mt-0.5">60 minutos · Lunes 8:00 AM · Estructura completa</p>
          </div>
          <span className="text-slate-400 text-lg">{showMeeting ? '↑' : '↓'}</span>
        </div>
      </button>

      {showMeeting && (
        <div className="card mt-3 border-navy/20">
          <div className="space-y-4">
            {MEETING.map((m, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 text-center w-16">
                  <p className="text-xs font-bold text-accent">{m.tiempo}</p>
                </div>
                <div className="flex-1 pb-4 border-b border-slate-100 last:border-0">
                  <p className="text-sm font-semibold text-navy mb-1">{m.bloque}</p>
                  <p className="text-sm text-slate-600 leading-relaxed">{m.contenido}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-navy mb-2">Reglas de oro</p>
            {[
              'Si no tienes los números, no puedes hablar de los KPIs — solo escuchar.',
              '"No sé por qué" no es una respuesta aceptable para un KPI rojo.',
              'Las decisiones se toman aquí, no en el pasillo después.',
              'Quien tiene un compromiso pendiente lo menciona antes de recibir nuevas tareas.',
            ].map((r, i) => (
              <p key={i} className="text-xs text-slate-500 mb-1">{i + 1}. {r}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
