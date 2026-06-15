'use client'
import { useState, useEffect } from 'react'
import { KPIS } from '@/data/content'

type Status = 'verde' | 'amarillo' | 'rojo' | null

const WEEK_KEY = () => {
  const d = new Date()
  const week = Math.ceil(d.getDate() / 7)
  return `scorecard-${d.getFullYear()}-${d.getMonth()}-w${week}`
}

export default function ScorecardTab() {
  const [statuses, setStatuses] = useState<Record<number, Status>>({})
  const [notas, setNotas] = useState<Record<number, string>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem(WEEK_KEY() + '-status')
    const n = localStorage.getItem(WEEK_KEY() + '-notas')
    if (s) setStatuses(JSON.parse(s))
    if (n) setNotas(JSON.parse(n))
    setLoaded(true)
  }, [])

  const setStatus = (num: number, val: Status) => {
    const next = { ...statuses, [num]: statuses[num] === val ? null : val }
    setStatuses(next)
    localStorage.setItem(WEEK_KEY() + '-status', JSON.stringify(next))
  }

  const setNota = (num: number, val: string) => {
    const next = { ...notas, [num]: val }
    setNotas(next)
    localStorage.setItem(WEEK_KEY() + '-notas', JSON.stringify(next))
  }

  const verde = Object.values(statuses).filter(s => s === 'verde').length
  const amarillo = Object.values(statuses).filter(s => s === 'amarillo').length
  const rojo = Object.values(statuses).filter(s => s === 'rojo').length

  const btnClass = (s: Status, current: Status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-medium border transition-all '
    if (s === 'verde') return base + (current === 'verde' ? 'bg-accent text-white border-accent' : 'border-border text-slate-500 hover:border-accent hover:text-accent')
    if (s === 'amarillo') return base + (current === 'amarillo' ? 'bg-amber text-white border-amber' : 'border-border text-slate-500 hover:border-amber hover:text-amber')
    return base + (current === 'rojo' ? 'bg-danger text-white border-danger' : 'border-border text-slate-500 hover:border-danger hover:text-danger')
  }

  if (!loaded) return <div className="text-slate-400 text-sm">Cargando...</div>

  return (
    <div>
      <div className="mb-8">
        <p className="section-header">Revisión cada lunes antes de las 8:00 AM</p>
        <h1 className="text-2xl font-semibold text-navy">CEO Scorecard semanal</h1>
        <p className="text-sm text-slate-500 mt-1">Los datos se guardan automáticamente por semana.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card-sm text-center">
          <p className="text-3xl font-bold text-accent">{verde}</p>
          <p className="text-xs text-slate-500 mt-1">Verde</p>
        </div>
        <div className="card-sm text-center">
          <p className="text-3xl font-bold text-amber">{amarillo}</p>
          <p className="text-xs text-slate-500 mt-1">Amarillo</p>
        </div>
        <div className="card-sm text-center">
          <p className="text-3xl font-bold text-danger">{rojo}</p>
          <p className="text-xs text-slate-500 mt-1">Rojo</p>
        </div>
      </div>

      {/* KPI list */}
      <div className="space-y-3">
        {KPIS.map((k, i) => (
          <div key={k.num} className={`card transition-all ${statuses[k.num] === 'rojo' ? 'border-danger/30' : statuses[k.num] === 'amarillo' ? 'border-amber/30' : statuses[k.num] === 'verde' ? 'border-accent/30' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-surface text-navy text-xs font-bold flex items-center justify-center flex-shrink-0">{k.num}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-navy text-sm">{k.kpi}</p>
                <p className="text-xs text-slate-400 mt-0.5">{k.dimension} · {k.frecuencia} · {k.porque}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => setStatus(k.num, 'verde')} className={btnClass('verde', statuses[k.num] ?? null)}>Verde</button>
                <button onClick={() => setStatus(k.num, 'amarillo')} className={btnClass('amarillo', statuses[k.num] ?? null)}>Amarillo</button>
                <button onClick={() => setStatus(k.num, 'rojo')} className={btnClass('rojo', statuses[k.num] ?? null)}>Rojo</button>
              </div>
            </div>
            {(statuses[k.num] === 'rojo' || statuses[k.num] === 'amarillo') && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <input
                  type="text"
                  placeholder="Causa raíz + acción correctiva + responsable..."
                  value={notas[k.num] || ''}
                  onChange={e => setNota(k.num, e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-surface rounded-xl border border-border">
        <p className="text-xs font-semibold text-navy mb-1">Regla clave</p>
        <p className="text-xs text-slate-500">"No sé por qué" no es una respuesta aceptable para un KPI rojo. Todo indicador rojo necesita causa raíz, acción concreta y responsable nombrado antes de cerrar la reunión del lunes.</p>
      </div>
    </div>
  )
}
