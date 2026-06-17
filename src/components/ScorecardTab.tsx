'use client'
import { useState, useEffect } from 'react'
import { KPIS } from '@/data/content'

type Status = 'verde' | 'amarillo' | 'rojo' | null
type ViewMode = 'semanal' | 'historial'

// KPIs that are tracked monthly, not weekly
const MONTHLY_KPIS = [3, 4, 6, 10]

const getCurrentWeekKey = () => {
  const d = new Date()
  const week = Math.ceil(d.getDate() / 7)
  return `scorecard-${d.getFullYear()}-${d.getMonth()}-w${week}`
}

const getCurrentMonthKey = () => {
  const d = new Date()
  return `scorecard-month-${d.getFullYear()}-${d.getMonth()}`
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const getMonthLabel = (key: string) => {
  // key format: scorecard-month-YYYY-M
  const parts = key.replace('scorecard-month-', '').split('-')
  const year = parts[0]
  const month = parseInt(parts[1])
  return `${MONTH_NAMES[month]} ${year}`
}

const getWeekLabel = (key: string) => {
  // key format: scorecard-YYYY-M-wN
  const match = key.match(/scorecard-(\d+)-(\d+)-w(\d+)/)
  if (!match) return key
  const year = match[1]
  const month = parseInt(match[2])
  const week = match[3]
  return `Sem ${week} · ${MONTH_NAMES[month]} ${year}`
}

// Generate past period keys for history entry
const getPastWeekKeys = () => {
  const keys: string[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const week = Math.ceil(d.getDate() / 7)
    keys.push(`scorecard-${d.getFullYear()}-${d.getMonth()}-w${week}`)
  }
  return [...new Set(keys)]
}

const getPastMonthKeys = () => {
  const keys: string[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(`scorecard-month-${d.getFullYear()}-${d.getMonth()}`)
  }
  return keys
}

export default function ScorecardTab() {
  const [view, setView] = useState<ViewMode>('semanal')
  const [statuses, setStatuses] = useState<Record<number, Status>>({})
  const [notas, setNotas] = useState<Record<number, string>>({})
  const [valores, setValores] = useState<Record<number, string>>({})
  const [loaded, setLoaded] = useState(false)

  // History state
  const [historyWeekKey, setHistoryWeekKey] = useState(getPastWeekKeys()[1] || '')
  const [historyMonthKey, setHistoryMonthKey] = useState(getPastMonthKeys()[1] || '')
  const [histWeekData, setHistWeekData] = useState<Record<string, Record<number, { status: Status; nota: string; valor: string }>>>({})
  const [histMonthData, setHistMonthData] = useState<Record<string, Record<number, { status: Status; nota: string; valor: string }>>>({})

  const weekKey = getCurrentWeekKey()
  const monthKey = getCurrentMonthKey()

  useEffect(() => {
    // Load current week
    const s = localStorage.getItem(weekKey + '-status')
    const n = localStorage.getItem(weekKey + '-notas')
    const v = localStorage.getItem(weekKey + '-valores')
    if (s) setStatuses(JSON.parse(s))
    if (n) setNotas(JSON.parse(n))
    if (v) setValores(JSON.parse(v))

    // Load all history
    loadAllHistory()
    setLoaded(true)
  }, [])

  const loadAllHistory = () => {
    const weekKeys = getPastWeekKeys()
    const monthKeys = getPastMonthKeys()
    const wData: Record<string, Record<number, { status: Status; nota: string; valor: string }>> = {}
    const mData: Record<string, Record<number, { status: Status; nota: string; valor: string }>> = {}

    weekKeys.forEach(k => {
      const s = localStorage.getItem(k + '-status')
      const n = localStorage.getItem(k + '-notas')
      const v = localStorage.getItem(k + '-valores')
      const entry: Record<number, { status: Status; nota: string; valor: string }> = {}
      KPIS.filter(kpi => !MONTHLY_KPIS.includes(kpi.num)).forEach(kpi => {
        entry[kpi.num] = {
          status: s ? (JSON.parse(s)[kpi.num] ?? null) : null,
          nota: n ? (JSON.parse(n)[kpi.num] ?? '') : '',
          valor: v ? (JSON.parse(v)[kpi.num] ?? '') : '',
        }
      })
      wData[k] = entry
    })

    monthKeys.forEach(k => {
      const s = localStorage.getItem(k + '-status')
      const n = localStorage.getItem(k + '-notas')
      const v = localStorage.getItem(k + '-valores')
      const entry: Record<number, { status: Status; nota: string; valor: string }> = {}
      KPIS.filter(kpi => MONTHLY_KPIS.includes(kpi.num)).forEach(kpi => {
        entry[kpi.num] = {
          status: s ? (JSON.parse(s)[kpi.num] ?? null) : null,
          nota: n ? (JSON.parse(n)[kpi.num] ?? '') : '',
          valor: v ? (JSON.parse(v)[kpi.num] ?? '') : '',
        }
      })
      mData[k] = entry
    })

    setHistWeekData(wData)
    setHistMonthData(mData)
  }

  const setStatus = (num: number, val: Status) => {
    const key = MONTHLY_KPIS.includes(num) ? monthKey : weekKey
    const storageKey = key + '-status'
    const current = JSON.parse(localStorage.getItem(storageKey) || '{}')
    current[num] = current[num] === val ? null : val
    localStorage.setItem(storageKey, JSON.stringify(current))
    if (!MONTHLY_KPIS.includes(num)) setStatuses({ ...current })
    loadAllHistory()
  }

  const setNota = (num: number, val: string) => {
    const key = MONTHLY_KPIS.includes(num) ? monthKey : weekKey
    const storageKey = key + '-notas'
    const current = JSON.parse(localStorage.getItem(storageKey) || '{}')
    current[num] = val
    localStorage.setItem(storageKey, JSON.stringify(current))
    if (!MONTHLY_KPIS.includes(num)) setNotas({ ...current })
  }

  const setValor = (num: number, val: string) => {
    const key = MONTHLY_KPIS.includes(num) ? monthKey : weekKey
    const storageKey = key + '-valores'
    const current = JSON.parse(localStorage.getItem(storageKey) || '{}')
    current[num] = val
    localStorage.setItem(storageKey, JSON.stringify(current))
    if (!MONTHLY_KPIS.includes(num)) setValores({ ...current })
  }

  const saveHistEntry = (kpiNum: number, field: 'status' | 'nota' | 'valor', value: string | Status, isMonthly: boolean) => {
    const key = isMonthly ? historyMonthKey : historyWeekKey
    const storageKey = key + '-' + (field === 'status' ? 'status' : field === 'nota' ? 'notas' : 'valores')
    const current = JSON.parse(localStorage.getItem(storageKey) || '{}')
    current[kpiNum] = value
    localStorage.setItem(storageKey, JSON.stringify(current))
    loadAllHistory()
  }

  const getMonthlyStatus = (num: number): Status => {
    const s = localStorage.getItem(monthKey + '-status')
    return s ? (JSON.parse(s)[num] ?? null) : null
  }

  const getMonthlyNota = (num: number): string => {
    const n = localStorage.getItem(monthKey + '-notas')
    return n ? (JSON.parse(n)[num] ?? '') : ''
  }

  const getMonthlyValor = (num: number): string => {
    const v = localStorage.getItem(monthKey + '-valores')
    return v ? (JSON.parse(v)[num] ?? '') : ''
  }

  const getStatusForKpi = (num: number): Status =>
    MONTHLY_KPIS.includes(num) ? getMonthlyStatus(num) : (statuses[num] ?? null)

  const getNotaForKpi = (num: number): string =>
    MONTHLY_KPIS.includes(num) ? getMonthlyNota(num) : (notas[num] ?? '')

  const getValorForKpi = (num: number): string =>
    MONTHLY_KPIS.includes(num) ? getMonthlyValor(num) : (valores[num] ?? '')

  const allStatuses = KPIS.map(k => getStatusForKpi(k.num))
  const verde = allStatuses.filter(s => s === 'verde').length
  const amarillo = allStatuses.filter(s => s === 'amarillo').length
  const rojo = allStatuses.filter(s => s === 'rojo').length

  const btnClass = (s: Status, current: Status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-medium border transition-all '
    if (s === 'verde') return base + (current === 'verde' ? 'bg-accent text-white border-accent' : 'border-border text-slate-500 hover:border-accent hover:text-accent')
    if (s === 'amarillo') return base + (current === 'amarillo' ? 'bg-amber text-white border-amber' : 'border-border text-slate-500 hover:border-amber hover:text-amber')
    return base + (current === 'rojo' ? 'bg-danger text-white border-danger' : 'border-border text-slate-500 hover:border-danger hover:text-danger')
  }

  const statusDot = (s: Status) => {
    if (s === 'verde') return '🟢'
    if (s === 'amarillo') return '🟡'
    if (s === 'rojo') return '🔴'
    return '⚪'
  }

  if (!loaded) return <div className="text-slate-400 text-sm">Cargando...</div>

  return (
    <div>
      <div className="mb-6">
        <p className="section-header">Revisión cada lunes antes de las 9:00 AM</p>
        <h1 className="text-2xl font-semibold text-navy">CEO Scorecard</h1>
        <p className="text-sm text-slate-500 mt-1">Los datos se guardan automáticamente por semana y mes.</p>
      </div>

      {/* View toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setView('semanal')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${view === 'semanal' ? 'bg-navy text-white border-navy' : 'border-border text-slate-500 hover:border-navy hover:text-navy'}`}
        >
          Semana actual
        </button>
        <button
          onClick={() => setView('historial')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${view === 'historial' ? 'bg-navy text-white border-navy' : 'border-border text-slate-500 hover:border-navy hover:text-navy'}`}
        >
          Ingresar historial
        </button>
      </div>

      {view === 'semanal' && (
        <>
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

          {/* Weekly KPIs */}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">KPIs Semanales</p>
          <div className="space-y-3 mb-6">
            {KPIS.filter(k => !MONTHLY_KPIS.includes(k.num)).map(k => {
              const currentStatus = getStatusForKpi(k.num)
              return (
                <div key={k.num} className={`card transition-all ${currentStatus === 'rojo' ? 'border-danger/30' : currentStatus === 'amarillo' ? 'border-amber/30' : currentStatus === 'verde' ? 'border-accent/30' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-surface text-navy text-xs font-bold flex items-center justify-center flex-shrink-0">{k.num}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy text-sm">{k.kpi}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{k.dimension} · {k.frecuencia} · {k.porque}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input
                        type="text"
                        placeholder="Valor"
                        value={getValorForKpi(k.num)}
                        onChange={e => setValor(k.num, e.target.value)}
                        className="w-20 text-sm border border-border rounded-lg px-2 py-1 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy text-center"
                      />
                      <div className="flex gap-1.5">
                        <button onClick={() => setStatus(k.num, 'verde')} className={btnClass('verde', currentStatus)}>Verde</button>
                        <button onClick={() => setStatus(k.num, 'amarillo')} className={btnClass('amarillo', currentStatus)}>Amarillo</button>
                        <button onClick={() => setStatus(k.num, 'rojo')} className={btnClass('rojo', currentStatus)}>Rojo</button>
                      </div>
                    </div>
                  </div>
                  {(currentStatus === 'rojo' || currentStatus === 'amarillo') && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <input
                        type="text"
                        placeholder="Causa raíz + acción correctiva + responsable..."
                        value={getNotaForKpi(k.num)}
                        onChange={e => setNota(k.num, e.target.value)}
                        className="w-full text-sm border border-border rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Monthly KPIs */}
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">KPIs Mensuales · {MONTH_NAMES[new Date().getMonth()]}</p>
          <div className="space-y-3 mb-6">
            {KPIS.filter(k => MONTHLY_KPIS.includes(k.num)).map(k => {
              const currentStatus = getStatusForKpi(k.num)
              return (
                <div key={k.num} className={`card transition-all ${currentStatus === 'rojo' ? 'border-danger/30' : currentStatus === 'amarillo' ? 'border-amber/30' : currentStatus === 'verde' ? 'border-accent/30' : ''}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-surface text-navy text-xs font-bold flex items-center justify-center flex-shrink-0">{k.num}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy text-sm">{k.kpi}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{k.dimension} · <span className="text-amber font-medium">Mensual</span> · {k.porque}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <input
                        type="text"
                        placeholder="Valor"
                        value={getValorForKpi(k.num)}
                        onChange={e => setValor(k.num, e.target.value)}
                        className="w-20 text-sm border border-border rounded-lg px-2 py-1 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy text-center"
                      />
                      <div className="flex gap-1.5">
                        <button onClick={() => setStatus(k.num, 'verde')} className={btnClass('verde', currentStatus)}>Verde</button>
                        <button onClick={() => setStatus(k.num, 'amarillo')} className={btnClass('amarillo', currentStatus)}>Amarillo</button>
                        <button onClick={() => setStatus(k.num, 'rojo')} className={btnClass('rojo', currentStatus)}>Rojo</button>
                      </div>
                    </div>
                  </div>
                  {(currentStatus === 'rojo' || currentStatus === 'amarillo') && (
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <input
                        type="text"
                        placeholder="Causa raíz + acción correctiva + responsable..."
                        value={getNotaForKpi(k.num)}
                        onChange={e => setNota(k.num, e.target.value)}
                        className="w-full text-sm border border-border rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy"
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 bg-surface rounded-xl border border-border">
            <p className="text-xs font-semibold text-navy mb-1">Regla clave</p>
            <p className="text-xs text-slate-500">"No sé por qué" no es una respuesta aceptable para un KPI rojo. Todo indicador rojo necesita causa raíz, acción concreta y responsable nombrado antes de cerrar la reunión del lunes.</p>
          </div>
        </>
      )}

      {view === 'historial' && (
        <div>
          <p className="text-sm text-slate-500 mb-6">Ingresa datos de semanas y meses anteriores para construir tu historial de tendencias.</p>

          {/* Weekly history */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-semibold text-navy">KPIs Semanales — Semana:</p>
              <select
                value={historyWeekKey}
                onChange={e => setHistoryWeekKey(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy"
              >
                {getPastWeekKeys().map(k => (
                  <option key={k} value={k}>{getWeekLabel(k)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {KPIS.filter(k => !MONTHLY_KPIS.includes(k.num)).map(k => {
                const entry = histWeekData[historyWeekKey]?.[k.num]
                const currentStatus = entry?.status ?? null
                return (
                  <div key={k.num} className="card">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-surface text-navy text-xs font-bold flex items-center justify-center flex-shrink-0">{k.num}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-navy text-sm">{k.kpi}</p>
                        <p className="text-xs text-slate-400">{k.dimension}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="text"
                          placeholder="Valor"
                          defaultValue={entry?.valor ?? ''}
                          onBlur={e => saveHistEntry(k.num, 'valor', e.target.value, false)}
                          className="w-20 text-sm border border-border rounded-lg px-2 py-1 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy text-center"
                        />
                        <div className="flex gap-1.5">
                          {(['verde', 'amarillo', 'rojo'] as Status[]).map(s => (
                            <button key={s} onClick={() => saveHistEntry(k.num, 'status', s === currentStatus ? null : s, false)} className={btnClass(s, currentStatus)}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {(currentStatus === 'rojo' || currentStatus === 'amarillo') && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <input
                          type="text"
                          placeholder="Nota o causa raíz..."
                          defaultValue={entry?.nota ?? ''}
                          onBlur={e => saveHistEntry(k.num, 'nota', e.target.value, false)}
                          className="w-full text-sm border border-border rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Monthly history */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-semibold text-navy">KPIs Mensuales — Mes:</p>
              <select
                value={historyMonthKey}
                onChange={e => setHistoryMonthKey(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy"
              >
                {getPastMonthKeys().map(k => (
                  <option key={k} value={k}>{getMonthLabel(k)}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              {KPIS.filter(k => MONTHLY_KPIS.includes(k.num)).map(k => {
                const entry = histMonthData[historyMonthKey]?.[k.num]
                const currentStatus = entry?.status ?? null
                return (
                  <div key={k.num} className="card">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-surface text-navy text-xs font-bold flex items-center justify-center flex-shrink-0">{k.num}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-navy text-sm">{k.kpi}</p>
                        <p className="text-xs text-slate-400">{k.dimension} · Mensual</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <input
                          type="text"
                          placeholder="Valor"
                          defaultValue={entry?.valor ?? ''}
                          onBlur={e => saveHistEntry(k.num, 'valor', e.target.value, true)}
                          className="w-20 text-sm border border-border rounded-lg px-2 py-1 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy text-center"
                        />
                        <div className="flex gap-1.5">
                          {(['verde', 'amarillo', 'rojo'] as Status[]).map(s => (
                            <button key={s} onClick={() => saveHistEntry(k.num, 'status', s === currentStatus ? null : s, true)} className={btnClass(s, currentStatus)}>
                              {s.charAt(0).toUpperCase() + s.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    {(currentStatus === 'rojo' || currentStatus === 'amarillo') && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <input
                          type="text"
                          placeholder="Nota o causa raíz..."
                          defaultValue={entry?.nota ?? ''}
                          onBlur={e => saveHistEntry(k.num, 'nota', e.target.value, true)}
                          className="w-full text-sm border border-border rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Summary table */}
          <div className="mt-8">
            <p className="text-sm font-semibold text-navy mb-4">Resumen de tendencias — últimas 8 semanas</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left text-slate-500 font-medium py-2 pr-3 min-w-[120px]">KPI</th>
                    {getPastWeekKeys().slice(0, 8).reverse().map(k => (
                      <th key={k} className="text-center text-slate-400 font-normal py-2 px-1 min-w-[60px]">{getWeekLabel(k).split('·')[0].trim()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {KPIS.filter(k => !MONTHLY_KPIS.includes(k.num)).map(k => (
                    <tr key={k.num} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-600 font-medium">{k.kpi}</td>
                      {getPastWeekKeys().slice(0, 8).reverse().map(wk => {
                        const s = histWeekData[wk]?.[k.num]?.status ?? null
                        const v = histWeekData[wk]?.[k.num]?.valor ?? ''
                        return (
                          <td key={wk} className="text-center py-2 px-1">
                            <div>{statusDot(s)}</div>
                            {v && <div className="text-slate-400 text-xs">{v}</div>}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm font-semibold text-navy mb-4 mt-6">Resumen mensual — últimos 6 meses</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left text-slate-500 font-medium py-2 pr-3 min-w-[140px]">KPI</th>
                    {getPastMonthKeys().slice(0, 6).reverse().map(k => (
                      <th key={k} className="text-center text-slate-400 font-normal py-2 px-1 min-w-[70px]">{getMonthLabel(k)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {KPIS.filter(k => MONTHLY_KPIS.includes(k.num)).map(k => (
                    <tr key={k.num} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-600 font-medium">{k.kpi}</td>
                      {getPastMonthKeys().slice(0, 6).reverse().map(mk => {
                        const s = histMonthData[mk]?.[k.num]?.status ?? null
                        const v = histMonthData[mk]?.[k.num]?.valor ?? ''
                        return (
                          <td key={mk} className="text-center py-2 px-1">
                            <div>{statusDot(s)}</div>
                            {v && <div className="text-slate-400 text-xs">{v}</div>}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
