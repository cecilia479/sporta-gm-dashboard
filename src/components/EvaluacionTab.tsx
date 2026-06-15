'use client'
import { useState } from 'react'
import { DIMENSIONS } from '@/data/content'

function scoreColor(s: number) {
  if (s >= 7.5) return 'text-accent'
  if (s >= 6.5) return 'text-amber'
  return 'text-danger'
}
function scoreBg(s: number) {
  if (s >= 7.5) return 'bg-accent-light text-accent'
  if (s >= 6.5) return 'bg-amber-light text-amber'
  return 'bg-danger-light text-danger'
}
function barColor(s: number) {
  if (s >= 7.5) return 'bg-accent'
  if (s >= 6.5) return 'bg-amber'
  return 'bg-danger'
}

export default function EvaluacionTab() {
  const [selected, setSelected] = useState<string | null>(null)
  const avg = (DIMENSIONS.reduce((a, d) => a + d.score, 0) / DIMENSIONS.length).toFixed(1)
  const dim = DIMENSIONS.find(d => d.id === selected)

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="section-header">Board of Directors · Evaluación Ejecutiva</p>
        <h1 className="text-2xl font-semibold text-navy mb-1">Tu evaluación como Gerente General</h1>
        <p className="text-slate-500 text-sm">Estándares de CEO de empresa de alto crecimiento · Sporta 2026</p>
      </div>

      {/* Overall score */}
      <div className="card mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="flex items-baseline gap-2">
          <span className={`text-6xl font-bold ${scoreColor(parseFloat(avg))}`}>{avg}</span>
          <span className="text-slate-400 text-lg">/10</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-navy mb-1">Promedio general</p>
          <p className="text-slate-500 text-sm leading-relaxed">Sólida con alto potencial. Las bases están — el reto es escalar desde buena operadora a líder estratégica de clase mundial.</p>
          <div className="mt-3 progress-bar">
            <div className={`progress-fill ${barColor(parseFloat(avg))}`} style={{ width: `${parseFloat(avg) * 10}%` }} />
          </div>
        </div>
      </div>

      {/* Alert */}
      <div className="border border-danger/20 bg-danger-light rounded-xl p-4 mb-8">
        <p className="text-sm font-semibold text-danger mb-1">Inconsistencia clave que el Board señala</p>
        <p className="text-sm text-slate-600 leading-relaxed">Tu filosofía dice "lo que no tiene responsable no sucede" — pero la salida del Operations Manager reveló que tú eras un responsable implícito de cosas sin dueño formal. Resuélvelo antes de cualquier otra iniciativa.</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {DIMENSIONS.map(d => (
          <button
            key={d.id}
            onClick={() => setSelected(selected === d.id ? null : d.id)}
            className={`card-sm text-left transition-all hover:shadow-md hover:-translate-y-0.5 ${selected === d.id ? 'ring-2 ring-navy' : ''}`}
          >
            <div className="text-xl mb-2">{d.icon}</div>
            <p className="text-xs text-slate-500 mb-1 leading-tight">{d.label}</p>
            <p className={`text-2xl font-bold ${scoreColor(d.score)}`}>{d.score}</p>
            <div className="mt-2 progress-bar">
              <div className={`progress-fill ${barColor(d.score)}`} style={{ width: `${d.score * 10}%` }} />
            </div>
          </button>
        ))}
      </div>

      {/* Detail panel */}
      {dim && (
        <div className="card border-navy/10 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{dim.icon}</span>
              <div>
                <h2 className="font-semibold text-navy text-lg">{dim.label}</h2>
                <span className={`score-pill ${scoreBg(dim.score)}`}>{dim.score}/10</span>
              </div>
            </div>
            <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-xl leading-none">×</button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="section-header">Por qué esta calificación</p>
              <p className="text-sm text-slate-600 leading-relaxed">{dim.motivo}</p>
            </div>
            <div>
              <p className="section-header text-danger">Riesgo si no mejoras</p>
              <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-danger/30 pl-3">{dim.riesgo}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <p className="section-header text-accent">Acciones concretas</p>
              <ul className="space-y-2">
                {dim.acciones.map((a, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-accent font-bold flex-shrink-0">{i + 1}.</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="section-header">Hábitos semanales</p>
              <ul className="space-y-2">
                {dim.habitos.map((h, i) => (
                  <li key={i} className="flex gap-2 text-sm text-slate-600">
                    <span className="text-slate-300 flex-shrink-0">→</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {!selected && (
        <p className="text-center text-sm text-slate-400 mt-4">Selecciona una dimensión para ver el análisis completo</p>
      )}
    </div>
  )
}
