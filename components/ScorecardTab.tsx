'use client'
import { useState, useEffect } from 'react'
import { KPIS } from '@/data/content'

type Status = 'verde' | 'amarillo' | 'rojo' | null
type NonNullStatus = 'verde' | 'amarillo' | 'rojo'
type ViewMode = 'semanal' | 'historial'

const MONTHLY_KPIS = [3, 4, 6, 10]
const STATUS_OPTIONS: NonNullStatus[] = ['verde', 'amarillo', 'rojo']

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
  const parts = key.replace('scorecard-month-', '').split('-')
  const year = parts[0]
  const month = parseInt(parts[1])
  return `${MONTH_NAMES[month]} ${year}`
}

const getWeekLabel = (key: string) => {
  const match = key.match(/scorecard-(\d+)-(\d+)-w(\d+)/)
  if (!match) return key
  const year = match[1]
  const month = parseInt(match[2])
  const week = match[3]
  return `Sem ${week} · ${MONTH_NAMES[month]} ${year}`
}

const getPastWeekKeys = (): string[] => {
  const keys: string[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const week = Math.ceil(d.getDate() / 7)
    keys.push(`scorecard-${d.getFullYear()}-${d.getMonth()}-w${week}`)
  }
  return Array.from(new Set(keys))
}

const getPastMonthKeys = (): string[] => {
  const keys: string[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(`scorecard-month-${d.getFullYear()}-${d.getMonth()}`)
  }
  return keys
}

type HistEntry = { status: Status; nota: string; valor: string }
type HistData = Record<string, Record<number, HistEntry>>

export default function ScorecardTab() {
  const [view, setView] = useState<ViewMode>('semanal')
  const [statuses, setStatuses] = useState<Record<number, Status>>({})
  const [notas, setNotas] = useState<Record<number, string>>({})
  const [valores, setValores] = useState<Record<number, string>>({})
  const [loaded, setLoaded] = useState(false)
  const [historyWeekKey, setHistoryWeekKey] = useState(getPastWeekKeys()[1] || '')
  const [historyMonthKey, setHistoryMonthKey] = useState(getPastMonthKeys()[1] || '')
  const [histWeekData, setHistWeekData] = useState<HistData>({})
  const [histMonthData, setHistMonthData] = useState<HistData>({})

  const weekKey = getCurrentWeekKey()
  const monthKey = getCurrentMonthKey()

  const loadAllHistory = () => {
    const wData: HistData = {}
    const mData: HistData = {}

    getPastWeekKeys().forEach(k => {
      const s = localStorage.getItem(k + '-status')
      const n = localStorage.getItem(k + '-notas')
      const v = localStorage.getItem(k + '-valores')
      const entry: Record<number, HistEntry> = {}
      KPIS.filter(kpi => !MONTHLY_KPIS.includes(kpi.num)).forEach(kpi => {
        entry[kpi.num] = {
          status: s ? (JSON.parse(s)[kpi.num] ?? null) : null,
          nota: n ? (JSON.parse(n)[kpi.num] ?? '') : '',
          valor: v ? (JSON.parse(v)[kpi.num] ?? '') : '',
        }
      })
      wData[k] = entry
    })

    getPastMonthKeys().forEach(k => {
      const s = localStorage.getItem(k + '-status')
      const n = localStorage.getItem(k + '-notas')
      const v = localStorage.getItem(k + '-valores')
      const entry: Record<number, HistEntry> = {}
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

  useEffect(() => {
    const s = localStorage.getItem(weekKey + '-status')
    const n = localStorage.getItem(weekKey + '-notas')
    const v = localStorage.getItem(weekKey + '-valores')
    if (s) setStatuses(JSON.parse(s))
    if (n) setNotas(JSON.parse(n))
    if (v) setValores(JSON.parse(v))
    loadAllHistory()
    setLoaded(true)
  }, [])

  const saveToStorage = (key: string, suffix: string, num: number, val: unknown) => {
    const storageKey = key + suffix
    const current = JSON.parse(localStorage.getItem(storageKey) || '{}')
    current[num] = val
    localStorage.setItem(storageKey, JSON.stringify(current))
    return current
  }

  const setStatus = (num: number, val: NonNullStatus) => {
    const key = MONTHLY_KPIS.includes(num) ? monthKey : weekKey
    const current = JSON.parse(localStorage.getItem(key + '-status') || '{}')
    current[num] = current[num] === val ? null : val
    localStorage.setItem(key + '-status', JSON.stringify(current))
    if (!MONTHLY_KPIS.includes(num)) setStatuses({ ...current })
    loadAllHistory()
  }

  const setNota = (num: number, val: string) => {
    const key = MONTHLY_KPIS.includes(num) ? monthKey : weekKey
    const current = saveToStorage(key, '-notas', num, val)
    if (!MONTHLY_KPIS.includes(num)) setNotas({ ...current })
  }

  const setValor = (num: number, val: string) => {
    const key = MONTHLY_KPIS.includes(num) ? monthKey : weekKey
    const current = saveToStorage(key, '-valores', num, val)
    if (!MONTHLY_KPIS.includes(num)) setValores({ ...current })
  }

  const saveHistStatus = (kpiNum: number, val: NonNullStatus, isMonthly: boolean) => {
    const key = isMonthly ? historyMonthKey : historyWeekKey
    const current = JSON.parse(localStorage.getItem(key + '-status') || '{}')
    current[kpiNum] = current[kpiNum] === val ? null : val
    localStorage.setItem(key + '-status', JSON.stringify(current))
    loadAllHistory()
  }

  const saveHistField = (kpiNum: number, field: 'notas' | 'valores', val: string, isMonthly: boolean) => {
    const key = isMonthly ? historyMonthKey : historyWeekKey
    saveToStorage(key, '-' + field, kpiNum, val)
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

  const btnClass = (s: NonNullStatus, current: Status) => {
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

  const capitalize = (s: NonNullStatus) => s.charAt(0).toUpperCase() + s.slice(1)

  const renderKpiCard = (k: typeof KPIS[0], isMonthly: boolean, isHistory: boolean = false) => {
    const currentStatus = isHistory
      ? (isMonthly ? histMonthData[historyMonthKey]?.[k.num]?.status ?? null : histWeekData[historyWeekKey]?.[k.num]?.status ?? null)
      : getStatusForKpi(k.num)
    const currentValor = isHistory
      ? (isMonthly ? histMonthData[historyMonthKey]?.[k.num]?.valor ?? '' : histWeekData[historyWeekKey]?.[k.num]?.valor ?? '')
      : getValorForKpi(k.num)
    const currentNota = isHistory
      ? (isMonthly ? histMonthData[historyMonthKey]?.[k.num]?.nota ?? '' : histWeekData[historyWeekKey]?.[k.num]?.nota ?? '')
      : getNotaForKpi(k.num)

    const handleStatus = (s: NonNullStatus) => {
      if (isHistory) saveHistStatus(k.num, s, isMonthly)
      else setStatus(k.num, s)
    }

    return (
      <div key={k.num} className={`card transition-all ${currentStatus === 'rojo' ? 'border-danger/30' : currentStatus === 'amarillo' ? 'border-amber/30' : currentStatus === 'verde' ? 'border-accent/30' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-surface text-navy text-xs font-bold flex items-center justify-center flex-shrink-0">{k.num}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-navy text-sm">{k.kpi}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {k.dimension} · {isMonthly ? <span className="text-amber font-medium">Mensual</span> : k.frecuencia}
              {!isHistory && ` · ${k.porque}`}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              placeholder="Valor"
              defaultValue={currentValor}
              onBlur={e => isHistory ? saveHistField(k.num, 'valores', e.target.value, isMonthly) : setValor(k.num, e.target.value)}
              className="w-20 text-sm border border-border rounded-lg px-2 py-1 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy text-center"
            />
            <div className="flex gap-1.5">
              {STATUS_OPTIONS.map(s => (
                <button key={s} onClick={() => handleStatus(s)} className={btnClass(s, currentStatus)}>
                  {capitalize(s)}
                </button>
              ))}
            </div>
          </div>
        </div>
        {(currentStatus === 'rojo' || currentStatus === 'amarillo') && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <input
              type="text"
              placeholder="Causa raíz + acción correctiva + responsable..."
              defaultValue={currentNota}
              onBlur={e => isHistory ? saveHistField(k.num, 'notas', e.target.value, isMonthly) : setNota(k.num, e.target.value)}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy"
            />
          </div>
        )}
      </div>
    )
  }

  if (!loaded) return <div className="text-slate-400 text-sm">Cargando...</div>

  return (
    <div>
      <div className="mb-6">
        <p className="section-header">Revisión cada lunes antes de las 9:00 AM</p>
        <h1 className="text-2xl font-semibold text-navy">CEO Scorecard</h1>
        <p className="text-sm text-slate-500 mt-1">Los datos se guardan automáticamente por semana y mes.</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setView('semanal')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${view === 'semanal' ? 'bg-navy text-white border-navy' : 'border-border text-slate-500 hover:border-navy hover:text-navy'}`}>
          Semana actual
        </button>
        <button onClick={() => setView('historial')} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${view === 'historial' ? 'bg-navy text-white border-navy' : 'border-border text-slate-500 hover:border-navy hover:text-navy'}`}>
          Ingresar historial
        </button>
      </div>

      {view === 'semanal' && (
        <>
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

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">KPIs Semanales</p>
          <div className="space-y-3 mb-6">
            {KPIS.filter(k => !MONTHLY_KPIS.includes(k.num)).map(k => renderKpiCard(k, false, false))}
          </div>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">KPIs Mensuales · {MONTH_NAMES[new Date().getMonth()]}</p>
          <div className="space-y-3 mb-6">
            {KPIS.filter(k => MONTHLY_KPIS.includes(k.num)).map(k => renderKpiCard(k, true, false))}
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

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-semibold text-navy">KPIs Semanales — Semana:</p>
              <select value={historyWeekKey} onChange={e => setHistoryWeekKey(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy">
                {getPastWeekKeys().map(k => <option key={k} value={k}>{getWeekLabel(k)}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {KPIS.filter(k => !MONTHLY_KPIS.includes(k.num)).map(k => renderKpiCard(k, false, true))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-semibold text-navy">KPIs Mensuales — Mes:</p>
              <select value={historyMonthKey} onChange={e => setHistoryMonthKey(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy">
                {getPastMonthKeys().map(k => <option key={k} value={k}>{getMonthLabel(k)}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {KPIS.filter(k => MONTHLY_KPIS.includes(k.num)).map(k => renderKpiCard(k, true, true))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm font-semibold text-navy mb-4">Tendencias — últimas 8 semanas</p>
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
                        const entry = histWeekData[wk]?.[k.num]
                        return (
                          <td key={wk} className="text-center py-2 px-1">
                            <div>{statusDot(entry?.status ?? null)}</div>
                            {entry?.valor && <div className="text-slate-400">{entry.valor}</div>}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm font-semibold text-navy mb-4 mt-6">Tendencias — últimos 6 meses</p>
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
                        const entry = histMonthData[mk]?.[k.num]
                        return (
                          <td key={mk} className="text-center py-2 px-1">
                            <div>{statusDot(entry?.status ?? null)}</div>
                            {entry?.valor && <div className="text-slate-400">{entry.valor}</div>}
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
