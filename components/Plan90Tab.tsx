'use client'
import { useState, useEffect } from 'react'
import { PLAN_90 } from '@/data/content'

const PLAN_KEY = 'plan90-checks'

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  accent: { bg: 'bg-accent-light', text: 'text-accent', border: 'border-accent/30', badge: 'bg-accent text-white' },
  amber: { bg: 'bg-amber-light', text: 'text-amber', border: 'border-amber/30', badge: 'bg-amber text-white' },
  navy: { bg: 'bg-navy/5', text: 'text-navy', border: 'border-navy/20', badge: 'bg-navy text-white' },
}

export default function Plan90Tab() {
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem(PLAN_KEY)
    if (s) setChecks(JSON.parse(s))
    setLoaded(true)
  }, [])

  const toggle = (key: string) => {
    const next = { ...checks, [key]: !checks[key] }
    setChecks(next)
    localStorage.setItem(PLAN_KEY, JSON.stringify(next))
  }

  const allItems = PLAN_90.flatMap(p => p.items)
  const done = allItems.filter(i => checks[i]).length

  if (!loaded) return <div className="text-slate-400 text-sm">Cargando...</div>

  return (
    <div>
      <div className="mb-8">
        <p className="section-header">Crecimiento personal estructurado · Un principio a la vez</p>
        <h1 className="text-2xl font-semibold text-navy">Plan de crecimiento personal — 90 días</h1>
      </div>

      {/* Overall progress */}
      <div className="card mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-navy">{done} de {allItems.length} compromisos completados</span>
          <span className="text-sm text-slate-400">{Math.round((done / allItems.length) * 100)}%</span>
        </div>
        <div className="progress-bar h-2">
          <div className="progress-fill bg-navy" style={{ width: `${(done / allItems.length) * 100}%` }} />
        </div>
      </div>

      {/* Months */}
      <div className="space-y-6">
        {PLAN_90.map(mes => {
          const c = COLOR_MAP[mes.color]
          const mesDone = mes.items.filter(i => checks[i]).length
          return (
            <div key={mes.mes} className={`card border ${c.border}`}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest ${c.text}`}>{mes.mes}</span>
                  <h2 className="text-lg font-semibold text-navy mt-1">{mes.foco}</h2>
                </div>
                <span className={`score-pill ${c.badge}`}>{mesDone}/{mes.items.length}</span>
              </div>
              <div className="space-y-1">
                {mes.items.map(item => (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className="w-full flex items-start gap-3 py-2.5 text-left border-b border-slate-100 last:border-0 group"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      checks[item] ? `${c.badge.split(' ')[0]} border-transparent` : `border-border group-hover:${c.border}`
                    }`}>
                      {checks[item] && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm leading-relaxed ${checks[item] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item}</span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Development system */}
      <div className="card mt-8">
        <h2 className="font-semibold text-navy mb-4">Sistema de desarrollo de líderes</h2>
        <div className="space-y-3">
          {[
            { ritmo: 'Semanal', accion: '1:1 de 30 min con cada líder directo. 50% proyectos, 50% desarrollo personal y obstáculos.' },
            { ritmo: 'Mensual', accion: 'Conversación de carrera: ¿hacia dónde quieres ir? ¿qué necesitas para llegar? ¿cómo te ayudo?' },
            { ritmo: 'Trimestral', accion: 'Evaluación formal de desempeño con nota y retroalimentación escrita. Sin excepciones ni postergaciones.' },
            { ritmo: 'Semestral', accion: 'Plan de desarrollo individual: una habilidad a desarrollar, un proyecto de stretch, un mentor interno.' },
            { ritmo: 'Anual', accion: 'Revisión de compensación y reconocimiento basada en resultados medibles y comportamientos de liderazgo.' },
          ].map((r, i) => (
            <div key={i} className="flex gap-4 pb-3 border-b border-slate-100 last:border-0">
              <span className="text-xs font-bold text-accent w-20 flex-shrink-0 pt-0.5">{r.ritmo}</span>
              <p className="text-sm text-slate-600 leading-relaxed">{r.accion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
