'use client'
import { useState, useEffect } from 'react'
import { CHECKLIST_ITEMS } from '@/data/content'

const TODAY_KEY = () => `checklist-${new Date().toISOString().split('T')[0]}`

export default function ChecklistTab() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(TODAY_KEY())
    if (saved) setChecked(JSON.parse(saved))
    setLoaded(true)
  }, [])

  const toggle = (key: string) => {
    const next = { ...checked, [key]: !checked[key] }
    setChecked(next)
    localStorage.setItem(TODAY_KEY(), JSON.stringify(next))
  }

  const resetDay = () => {
    setChecked({})
    localStorage.removeItem(TODAY_KEY())
  }

  const allItems = Object.values(CHECKLIST_ITEMS).flat()
  const total = allItems.length
  const done = allItems.filter(item => checked[item]).length
  const pct = Math.round((done / total) * 100)

  if (!loaded) return <div className="text-slate-400 text-sm">Cargando...</div>

  return (
    <div>
      <div className="mb-8">
        <p className="section-header">Uso diario · Cada mañana</p>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-navy">Checklist del día</h1>
          <button onClick={resetDay} className="text-xs text-slate-400 hover:text-slate-600 border border-border rounded-lg px-3 py-1.5 transition-colors">
            Reiniciar día
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="card mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-navy">{done} de {total} completados</span>
          <span className={`text-sm font-bold ${pct === 100 ? 'text-accent' : 'text-slate-400'}`}>{pct}%</span>
        </div>
        <div className="progress-bar h-2">
          <div
            className={`progress-fill ${pct === 100 ? 'bg-accent' : 'bg-navy'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && (
          <p className="text-accent text-sm mt-3 font-medium">✓ Día completo — bien hecho.</p>
        )}
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {Object.entries(CHECKLIST_ITEMS).map(([section, items]) => {
          const secDone = items.filter(i => checked[i]).length
          return (
            <div key={section} className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-navy">{section}</h2>
                <span className={`score-pill text-xs ${secDone === items.length ? 'bg-accent-light text-accent' : 'bg-surface text-slate-400'}`}>
                  {secDone}/{items.length}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {items.map(item => (
                  <button
                    key={item}
                    onClick={() => toggle(item)}
                    className="w-full flex items-start gap-3 py-3 text-left group"
                  >
                    <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      checked[item]
                        ? 'bg-accent border-accent'
                        : 'border-border group-hover:border-accent'
                    }`}>
                      {checked[item] && (
                        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm leading-relaxed ${checked[item] ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Closing question */}
      <div className="mt-8 border-l-4 border-navy bg-white rounded-r-xl p-5">
        <p className="text-sm font-semibold text-navy mb-2">Pregunta de cierre (viernes)</p>
        <p className="text-sm text-slate-600 italic leading-relaxed">
          "Si un observador externo revisara todo lo que hice esta semana, ¿concluiría que soy una GM estratégica o una administradora reactiva?"
        </p>
      </div>
    </div>
  )
}
