'use client'
import { useState, useEffect } from 'react'
import { KPIS } from '@/data/content'

type Status = 'verde' | 'amarillo' | 'rojo' | null
type NonNullStatus = 'verde' | 'amarillo' | 'rojo'
type ViewMode = 'semanal' | 'historial'
type HistEntry = { status: Status; nota: string; valor: string }
type HistData = Record<string, Record<number, HistEntry>>

const MONTHLY_KPIS = [3, 4, 6, 10]
const STATUS_OPTIONS: NonNullStatus[] = ['verde', 'amarillo', 'rojo']
const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const getCurrentWeekKey = () => {
  const d = new Date()
  return `scorecard-${d.getFullYear()}-${d.getMonth()}-w${Math.ceil(d.getDate() / 7)}`
}

const getCurrentMonthKey = () => {
  const d = new Date()
  return `scorecard-month-${d.getFullYear()}-${d.getMonth()}`
}

const getMonthLabel = (key: string) => {
  const parts = key.replace('scorecard-month-', '').split('-')
  return `${MONTH_NAMES[parseInt(parts[1])]} ${parts[0]}`
}

const getWeekLabel = (key: string) => {
  const match = key.match(/scorecard-(\d+)-(\d+)-w(\d+)/)
  if (!match) return key
  return `Sem ${match[3]} · ${MONTH_NAMES[parseInt(match[2])]} ${match[1]}`
}

const getPastWeekKeys = (): string[] => {
  const seen: Record<string, boolean> = {}
  const result: string[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now)
    d.setDate(d.getDate() - i * 7)
    const k = `scorecard-${d.getFullYear()}-${d.getMonth()}-w${Math.ceil(d.getDate() / 7)}`
    if (!seen[k]) { seen[k] = true; result.push(k) }
  }
  return result
}

const getPastMonthKeys = (): string[] => {
  const result: string[] = []
  const now = new Date()
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    result.push(`scorecard-month-${d.getFullYear()}-${d.getMonth()}`)
  }
  return result
}

const readStorage = (key: string): Record<number, string> => {
  try { return JSON.parse(localStorage.getItem(key) || '{}') } catch { return {} }
}

const writeStorage = (key: string, num: number, val: unknown) => {
  const current = readStorage(key)
  current[num] = val as string
  localStorage.setItem(key, JSON.stringify(current))
  return current
}

export default function ScorecardTab() {
  const [view, setView] = useState<ViewMode>('semanal')
  const [statuses, setStatuses] = useState<Record<number, Status>>({})
  const [notas, setNotas] = useState<Record<number, string>>({})
  const [valores, setValores] = useState<Record<number, string>>({})
  const [loaded, setLoaded] = useState(false)
  const [histWeekKey, setHistWeekKey] = useState('')
  const [histMonthKey, setHistMonthKey] = useState('')
  const [histWeekData, setHistWeekData] = useState<HistData>({})
  const [histMonthData, setHistMonthData] = useState<HistData>({})

  const weekKey = getCurrentWeekKey()
  const monthKey = getCurrentMonthKey()

  const loadHistory = () => {
    const wData: HistData = {}
    const mData: HistData = {}
    getPastWeekKeys().forEach(k => {
      const s = readStorage(k + '-status')
      const n = readStorage(k + '-notas')
      const v = readStorage(k + '-valores')
      const entry: Record<number, HistEntry> = {}
      KPIS.filter(kpi => !MONTHLY_KPIS.includes(kpi.num)).forEach(kpi => {
        entry[kpi.num] = { status: (s[kpi.num] as Status) ?? null, nota: n[kpi.num] ?? '', valor: v[kpi.num] ?? '' }
      })
      wData[k] = entry
    })
    getPastMonthKeys().forEach(k => {
      const s = readStorage(k + '-status')
      const n = readStorage(k + '-notas')
      const v = readStorage(k + '-valores')
      const entry: Record<number, HistEntry> = {}
      KPIS.filter(kpi => MONTHLY_KPIS.includes(kpi.num)).forEach(kpi => {
        entry[kpi.num] = { status: (s[kpi.num] as Status) ?? null, nota: n[kpi.num] ?? '', valor: v[kpi.num] ?? '' }
      })
      mData[k] = entry
    })
    setHistWeekData(wData)
    setHistMonthData(mData)
  }

  useEffect(() => {
    const s = readStorage(weekKey + '-status')
    const n = readStorage(weekKey + '-notas')
    const v = readStorage(weekKey + '-valores')
    const parsed: Record<number, Status> = {}
    Object.keys(s).forEach(k => { parsed[parseInt(k)] = s[parseInt(k)] as Status })
    setStatuses(parsed)
    setNotas(n as Record<number, string>)
    setValores(v as Record<number, string>)
    const wKeys = getPastWeekKeys()
    const mKeys = getPastMonthKeys()
    setHistWeekKey(wKeys[1] || wKeys[0] || '')
    setHistMonthKey(mKeys[1] || mKeys[0] || '')
    loadHistory()
    setLoaded(true)
  }, [])

  const getKey = (num: number) => MONTHLY_KPIS.includes(num) ? monthKey : weekKey
  const isMonthly = (num: number) => MONTHLY_KPIS.includes(num)

  const toggleStatus = (num: number, val: NonNullStatus, customKey?: string) => {
    const key = customKey ?? getKey(num)
    const current = readStorage(key + '-status')
    current[num] = current[num] === val ? '' : val
    localStorage.setItem(key + '-status', JSON.stringify(current))
    if (!customKey && !isMonthly(num)) {
      setStatuses(prev => ({ ...prev, [num]: prev[num] === val ? null : val }))
    }
    loadHistory()
  }

  const saveField = (num: number, field: 'notas' | 'valores', val: string, customKey?: string) => {
    const key = customKey ?? getKey(num)
    writeStorage(key + '-' + field, num, val)
    if (!customKey && !isMonthly(num)) {
      if (field === 'notas') setNotas(prev => ({ ...prev, [num]: val }))
      else setValores(prev => ({ ...prev, [num]: val }))
    }
  }

  const getStatus = (num: number): Status => {
    if (isMonthly(num)) return (readStorage(monthKey + '-status')[num] as Status) ?? null
    return statuses[num] ?? null
  }
  const getNota = (num: number): string => {
    if (isMonthly(num)) return readStorage(monthKey + '-notas')[num] ?? ''
    return notas[num] ?? ''
  }
  const getValor = (num: number): string => {
    if (isMonthly(num)) return readStorage(monthKey + '-valores')[num] ?? ''
    return valores[num] ?? ''
  }

  const allStatuses = KPIS.map(k => getStatus(k.num))
  const verde = allStatuses.filter(s => s === 'verde').length
  const amarillo = allStatuses.filter(s => s === 'amarillo').length
  const rojo = allStatuses.filter(s => s === 'rojo').length

  const btnClass = (s: NonNullStatus, current: Status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-medium border transition-all '
    if (s === 'verde') return base + (current === 'verde' ? 'bg-accent text-white border-accent' : 'border-border text-slate-500 hover:border-accent hover:text-accent')
    if (s === 'amarillo') return base + (current === 'amarillo' ? 'bg-amber text-white border-amber' : 'border-border text-slate-500 hover:border-amber hover:text-amber')
    return base + (current === 'rojo' ? 'bg-danger text-white border-danger' : 'border-border text-slate-500 hover:border-danger hover:text-danger')
  }

  const dot = (s: Status) => s === 'verde' ? '🟢' : s === 'amarillo' ? '🟡' : s === 'rojo' ? '🔴' : '⚪'
  const cap = (s: NonNullStatus) => s.charAt(0).toUpperCase() + s.slice(1)

  const KpiCard = ({ kpi, monthly, histKey }: { kpi: typeof KPIS[0]; monthly: boolean; histKey?: string }) => {
    const isHist = !!histKey
    const st: Status = isHist
      ? (monthly ? histMonthData[histMonthKey]?.[kpi.num]?.status : histWeekData[histWeekKey]?.[kpi.num]?.status) ?? null
      : getStatus(kpi.num)
    const val = isHist
      ? (monthly ? histMonthData[histMonthKey]?.[kpi.num]?.valor : histWeekData[histWeekKey]?.[kpi.num]?.valor) ?? ''
      : getValor(kpi.num)
    const nota = isHist
      ? (monthly ? histMonthData[histMonthKey]?.[kpi.num]?.nota : histWeekData[histWeekKey]?.[kpi.num]?.nota) ?? ''
      : getNota(kpi.num)
    return (
      <div className={`card transition-all ${st === 'rojo' ? 'border-danger/30' : st === 'amarillo' ? 'border-amber/30' : st === 'verde' ? 'border-accent/30' : ''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-surface text-navy text-xs font-bold flex items-center justify-center flex-shrink-0">{kpi.num}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-navy text-sm">{kpi.kpi}</p>
            <p className="text-xs text-slate-400 mt-0.5">{kpi.dimension} · {monthly ? <span className="text-amber font-medium">Mensual</span> : kpi.frecuencia}{!isHist && ` · ${kpi.porque}`}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <input type="text" placeholder="Valor" defaultValue={val}
              onBlur={e => saveField(kpi.num, 'valores', e.target.value, histKey)}
              className="w-20 text-sm border border-border rounded-lg px-2 py-1 text-center text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy" />
            <div className="flex gap-1.5">
              {STATUS_OPTIONS.map(s => (
                <button key={s} onClick={() => toggleStatus(kpi.num, s, histKey)} className={btnClass(s, st)}>{cap(s)}</button>
              ))}
            </div>
          </div>
        </div>
        {(st === 'rojo' || st === 'amarillo') && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <input type="text" placeholder="Causa raíz + acción correctiva + responsable..." defaultValue={nota}
              onBlur={e => saveField(kpi.num, 'notas', e.target.value, histKey)}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy" />
          </div>
        )}
      </div>
    )
  }

  if (!loaded) return <div className="text-slate-400 text-sm">Cargando...</div>

  const tabBtn = (mode: ViewMode, label: string) => (
    <button onClick={() => setView(mode)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${view === mode ? 'bg-navy text-white border-navy' : 'border-border text-slate-500 hover:border-navy hover:text-navy'}`}>{label}</button>
  )

  return (
    <div>
      <div className="mb-6">
        <p className="section-header">Revisión cada lunes antes de las 9:00 AM</p>
        <h1 className="text-2xl font-semibold text-navy">CEO Scorecard</h1>
        <p className="text-sm text-slate-500 mt-1">Los datos se guardan automáticamente por semana y mes.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {tabBtn('semanal', 'Semana actual')}
        {tabBtn('historial', 'Ingresar historial')}
      </div>

      {view === 'semanal' && (
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[['text-accent', verde, 'Verde'], ['text-amber', amarillo, 'Amarillo'], ['text-danger', rojo, 'Rojo']].map(([cls, val, lbl]) => (
              <div key={lbl as string} className="card-sm text-center">
                <p className={`text-3xl font-bold ${cls}`}>{val}</p>
                <p className="text-xs text-slate-500 mt-1">{lbl}</p>
              </div>
            ))}
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">KPIs Semanales</p>
          <div className="space-y-3 mb-6">
            {KPIS.filter(k => !MONTHLY_KPIS.includes(k.num)).map(k => <KpiCard key={k.num} kpi={k} monthly={false} />)}
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">KPIs Mensuales · {MONTH_NAMES[new Date().getMonth()]}</p>
          <div className="space-y-3 mb-6">
            {KPIS.filter(k => MONTHLY_KPIS.includes(k.num)).map(k => <KpiCard key={k.num} kpi={k} monthly={true} />)}
          </div>
          <div className="mt-6 p-4 bg-surface rounded-xl border border-border">
            <p className="text-xs font-semibold text-navy mb-1">Regla clave</p>
            <p className="text-xs text-slate-500">"No sé por qué" no es una respuesta aceptable para un KPI rojo. Todo indicador rojo necesita causa raíz, acción concreta y responsable nombrado antes de cerrar la reunión del lunes.</p>
          </div>
        </>
      )}

      {view === 'historial' && (
        <div>
          <p className="text-sm text-slate-500 mb-6">Ingresa datos de semanas y meses anteriores para construir tu historial.</p>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-semibold text-navy">KPIs Semanales — Semana:</p>
              <select value={histWeekKey} onChange={e => { setHistWeekKey(e.target.value); loadHistory() }}
                className="text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy">
                {getPastWeekKeys().map(k => <option key={k} value={k}>{getWeekLabel(k)}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {KPIS.filter(k => !MONTHLY_KPIS.includes(k.num)).map(k => <KpiCard key={k.num} kpi={k} monthly={false} histKey={histWeekKey} />)}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-semibold text-navy">KPIs Mensuales — Mes:</p>
              <select value={histMonthKey} onChange={e => { setHistMonthKey(e.target.value); loadHistory() }}
                className="text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy">
                {getPastMonthKeys().map(k => <option key={k} value={k}>{getMonthLabel(k)}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {KPIS.filter(k => MONTHLY_KPIS.includes(k.num)).map(k => <KpiCard key={k.num} kpi={k} monthly={true} histKey={histMonthKey} />)}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-navy mb-4">Tendencias — últimas 8 semanas</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left text-slate-500 font-medium py-2 pr-3 min-w-[120px]">KPI</th>
                    {getPastWeekKeys().slice(0, 8).reverse().map(k => (
                      <th key={k} className="text-center text-slate-400 font-normal py-2 px-1 min-w-[55px]">{getWeekLabel(k).split('·')[0].trim()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {KPIS.filter(k => !MONTHLY_KPIS.includes(k.num)).map(k => (
                    <tr key={k.num} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-600 font-medium">{k.kpi}</td>
                      {getPastWeekKeys().slice(0, 8).reverse().map(wk => {
                        const e = histWeekData[wk]?.[k.num]
                        return <td key={wk} className="text-center py-2 px-1"><div>{dot(e?.status ?? null)}</div>{e?.valor && <div className="text-slate-400">{e.valor}</div>}</td>
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
                        const e = histMonthData[mk]?.[k.num]
                        return <td key={mk} className="text-center py-2 px-1"><div>{dot(e?.status ?? null)}</div>{e?.valor && <div className="text-slate-400">{e.valor}</div>}</td>
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
