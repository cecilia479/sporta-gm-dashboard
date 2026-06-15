'use client'
import { useState, useEffect } from 'react'

const KPIS = [
  { num: 1, kpi: 'Churn de membresías', unit: '%', porque: 'Predictor #1 de salud del negocio', direction: 'down', defaultThresholds: { green: 3, yellow: 5 } },
  { num: 2, kpi: 'Nuevas membresías activas', unit: 'membresías', porque: 'Crecimiento neto de base', direction: 'up', defaultThresholds: { green: 30, yellow: 20 } },
  { num: 3, kpi: 'NPS o CSAT', unit: 'puntos', porque: 'Indicador líder de churn futuro', direction: 'up', defaultThresholds: { green: 50, yellow: 30 } },
  { num: 4, kpi: 'Utilización de espacios (%)', unit: '%', porque: 'Rentabilidad por metro cuadrado', direction: 'up', defaultThresholds: { green: 70, yellow: 50 } },
  { num: 5, kpi: 'Ingresos vs. presupuesto (%)', unit: '%', porque: 'Pulso financiero inmediato', direction: 'up', defaultThresholds: { green: 95, yellow: 85 } },
  { num: 6, kpi: 'EBITDA / margen operativo (%)', unit: '%', porque: 'Verdadera salud del negocio', direction: 'up', defaultThresholds: { green: 20, yellow: 10 } },
  { num: 7, kpi: 'Tasa de conversión de visitas (%)', unit: '%', porque: 'Eficiencia del funnel', direction: 'up', defaultThresholds: { green: 30, yellow: 20 } },
  { num: 8, kpi: 'Asistencia promedio por academia', unit: 'personas', porque: 'Engagement y riesgo de cancelación', direction: 'up', defaultThresholds: { green: 15, yellow: 10 } },
  { num: 9, kpi: 'Cumplimiento de compromisos (%)', unit: '%', porque: 'Accountability en acción', direction: 'up', defaultThresholds: { green: 90, yellow: 70 } },
  { num: 10, kpi: 'Ingresos eventos / alquileres', unit: 'Q', porque: 'Revenue de baja inversión marginal', direction: 'up', defaultThresholds: { green: 5000, yellow: 2000 } },
]

const STORAGE_KEY = 'scorecard-v2'
const THRESHOLD_KEY = 'scorecard-thresholds-v2'

function getWeekKey() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay() + 1)
  return d.toISOString().split('T')[0]
}

function getWeekLabel(weekKey) {
  const d = new Date(weekKey + 'T12:00:00')
  const end = new Date(d)
  end.setDate(d.getDate() + 6)
  return `${d.getDate()}/${d.getMonth() + 1} - ${end.getDate()}/${end.getMonth() + 1}`
}

function getStatus(kpi, value, thresholds) {
  if (value === '' || value === null || value === undefined) return 'sin dato'
  const t = thresholds[kpi.num] || kpi.defaultThresholds
  const v = Number(value)
  if (kpi.direction === 'up') {
    if (v >= t.green) return 'verde'
    if (v >= t.yellow) return 'amarillo'
    return 'rojo'
  } else {
    if (v <= t.green) return 'verde'
    if (v <= t.yellow) return 'amarillo'
    return 'rojo'
  }
}

const STATUS_STYLE = {
  verde: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200', text: 'Verde' },
  amarillo: { dot: 'bg-amber-400', badge: 'bg-amber-50 text-amber-700 border border-amber-200', text: 'Amarillo' },
  rojo: { dot: 'bg-red-500', badge: 'bg-red-50 text-red-700 border border-red-200', text: 'Rojo' },
  'sin dato': { dot: 'bg-slate-200', badge: 'bg-slate-50 text-slate-400 border border-slate-200', text: 'Sin dato' },
}

function MiniChart({ history, kpiNum, kpi, thresholds }) {
  const entries = history.filter(h => h.data[kpiNum] !== '' && h.data[kpiNum] !== undefined)
  const points = entries.map(h => Number(h.data[kpiNum]))
  if (points.length < 2) return <p className="text-xs text-slate-400 italic py-4">Necesitas al menos 2 semanas con datos para ver la tendencia.</p>

  const min = Math.min(...points) * 0.85
  const max = Math.max(...points) * 1.15 || 1
  const W = 400, H = 80, PAD = 8

  const x = (i) => PAD + (i / (points.length - 1)) * (W - PAD * 2)
  const y = (v) => H - PAD - ((v - min) / ((max - min) || 1)) * (H - PAD * 2)

  const pathD = points.map((v, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const areaD = `${pathD} L ${x(points.length - 1).toFixed(1)} ${H} L ${PAD} ${H} Z`

  const t = thresholds[kpiNum] || kpi.defaultThresholds
  const greenY = y(t.green)
  const yellowY = y(t.yellow)

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 200 }}>
        {greenY > PAD && greenY < H && (
          <line x1={PAD} y1={greenY.toFixed(1)} x2={W - PAD} y2={greenY.toFixed(1)} stroke="#10b981" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
        )}
        {yellowY > PAD && yellowY < H && (
          <line x1={PAD} y1={yellowY.toFixed(1)} x2={W - PAD} y2={yellowY.toFixed(1)} stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,3" opacity="0.6" />
        )}
        <path d={areaD} fill="#0D2137" opacity="0.05" />
        <path d={pathD} fill="none" stroke="#0D2137" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((v, i) => {
          const s = getStatus(kpi, v, thresholds)
          const col = s === 'verde' ? '#10b981' : s === 'amarillo' ? '#f59e0b' : s === 'rojo' ? '#ef4444' : '#94a3b8'
          return <circle key={i} cx={x(i).toFixed(1)} cy={y(v).toFixed(1)} r="4" fill={col} stroke="white" strokeWidth="1.5" />
        })}
      </svg>
      <div className="flex justify-between mt-1">
        {entries.map((h) => (
          <span key={h.weekKey} style={{ fontSize: 10 }} className="text-slate-400">{h.weekLabel}</span>
        ))}
      </div>
    </div>
  )
}

export default function ScorecardTab() {
  const [history, setHistory] = useState([])
  const [thresholds, setThresholds] = useState({})
  const [currentWeek, setCurrentWeek] = useState({})
  const [loaded, setLoaded] = useState(false)
  const [view, setView] = useState('entrada')
  const [expandedKpi, setExpandedKpi] = useState(null)
  const [saving, setSaving] = useState(false)

  const weekKey = getWeekKey()
  const weekLabel = getWeekLabel(weekKey)

  useEffect(() => {
    const h = localStorage.getItem(STORAGE_KEY)
    const t = localStorage.getItem(THRESHOLD_KEY)
    const parsed = h ? JSON.parse(h) : []
    const parsedT = t ? JSON.parse(t) : {}
    setHistory(parsed)
    setThresholds(parsedT)
    const thisWeek = parsed.find(e => e.weekKey === weekKey)
    setCurrentWeek(thisWeek?.data || {})
    setLoaded(true)
  }, [])

  const saveCurrentWeek = () => {
    setSaving(true)
    const existing = history.filter(e => e.weekKey !== weekKey)
    const entry = { weekKey, weekLabel, data: currentWeek }
    const next = [...existing, entry].sort((a, b) => a.weekKey.localeCompare(b.weekKey))
    setHistory(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setTimeout(() => setSaving(false), 800)
  }

  const saveThresholds = (next) => {
    setThresholds(next)
    localStorage.setItem(THRESHOLD_KEY, JSON.stringify(next))
  }

  const updateValue = (kpiNum, val) => {
    setCurrentWeek(prev => ({ ...prev, [kpiNum]: val === '' ? '' : Number(val) }))
  }

  const updateThreshold = (kpiNum, field, val) => {
    const current = thresholds[kpiNum] || KPIS.find(k => k.num === kpiNum).defaultThresholds
    saveThresholds({ ...thresholds, [kpiNum]: { ...current, [field]: Number(val) } })
  }

  const verde = KPIS.filter(k => getStatus(k, currentWeek[k.num], thresholds) === 'verde').length
  const amarillo = KPIS.filter(k => getStatus(k, currentWeek[k.num], thresholds) === 'amarillo').length
  const rojo = KPIS.filter(k => getStatus(k, currentWeek[k.num], thresholds) === 'rojo').length
  const sinDato = KPIS.filter(k => getStatus(k, currentWeek[k.num], thresholds) === 'sin dato').length

  if (!loaded) return <div className="text-slate-400 text-sm p-8">Cargando...</div>

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Revision cada lunes - 8:00 AM</p>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-navy">CEO Scorecard semanal</h1>
            <p className="text-sm text-slate-400 mt-0.5">Semana del {weekLabel}</p>
          </div>
          {view === 'entrada' && (
            <button onClick={saveCurrentWeek} className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${saving ? 'bg-emerald-500 text-white' : 'bg-navy text-white hover:opacity-90'}`}>
              {saving ? 'Guardado' : 'Guardar semana'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Verde', val: verde, cls: 'bg-emerald-50 text-emerald-700' },
          { label: 'Amarillo', val: amarillo, cls: 'bg-amber-50 text-amber-700' },
          { label: 'Rojo', val: rojo, cls: 'bg-red-50 text-red-700' },
          { label: 'Sin dato', val: sinDato, cls: 'bg-slate-50 text-slate-500' },
        ].map(({ label, val, cls }) => (
          <div key={label} className={`rounded-xl p-3 text-center ${cls}`}>
            <p className="text-2xl font-bold">{val}</p>
            <p className="text-xs mt-0.5 font-medium">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-1.5 mb-6 border-b border-slate-100 pb-3 overflow-x-auto">
        {[
          { id: 'entrada', label: 'Ingresar datos' },
          { id: 'historial', label: 'Historial' },
          { id: 'tendencias', label: 'Tendencias' },
          { id: 'umbrales', label: 'Umbrales' },
        ].map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${view === t.id ? 'bg-navy text-white border-navy' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {view === 'entrada' && (
        <div className="space-y-3">
          {KPIS.map(kpi => {
            const val = currentWeek[kpi.num]
            const status = getStatus(kpi, val, thresholds)
            const ss = STATUS_STYLE[status]
            const t = thresholds[kpi.num] || kpi.defaultThresholds
            const prevWeeks = history.filter(h => h.weekKey !== weekKey && h.data[kpi.num] !== '' && h.data[kpi.num] !== undefined)
            const prev = prevWeeks[prevWeeks.length - 1]
            const prevVal = prev?.data[kpi.num]
            const trend = val !== '' && val !== undefined && prevVal !== undefined && prevVal !== ''
              ? Number(val) > Number(prevVal) ? 'up' : Number(val) < Number(prevVal) ? 'down' : 'flat' : null
            const trendSymbol = trend === 'up' ? '↑' : trend === 'down' ? '↓' : trend === 'flat' ? '→' : null
            const trendColor = trend === 'up'
              ? (kpi.direction === 'up' ? 'text-emerald-600' : 'text-red-500')
              : trend === 'down'
              ? (kpi.direction === 'up' ? 'text-red-500' : 'text-emerald-600')
              : 'text-slate-400'

            const borderColor = status === 'verde' ? 'border-emerald-200' : status === 'amarillo' ? 'border-amber-200' : status === 'rojo' ? 'border-red-200' : 'border-slate-200'

            return (
              <div key={kpi.num} className={`bg-white rounded-xl border p-4 ${borderColor}`}>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="w-6 h-6 rounded-full bg-slate-100 text-navy text-xs font-bold flex items-center justify-center flex-shrink-0">{kpi.num}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy">{kpi.kpi}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Meta verde: {kpi.direction === 'up' ? '>=' : '<='}{t.green}{kpi.unit === '%' ? '%' : ''} · Amarillo: {kpi.direction === 'up' ? '>=' : '<='}{t.yellow}{kpi.unit === '%' ? '%' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {trendSymbol && <span className={`text-sm font-bold ${trendColor}`}>{trendSymbol}</span>}
                    <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden focus-within:border-navy transition-colors">
                      <input
                        type="number"
                        value={val === '' || val === undefined ? '' : String(val)}
                        onChange={e => updateValue(kpi.num, e.target.value)}
                        placeholder="—"
                        className="w-20 px-2 py-1.5 text-sm text-right font-mono focus:outline-none"
                      />
                      <span className="text-xs text-slate-400 pr-2 font-medium">{kpi.unit}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${ss.badge}`}>{ss.text}</span>
                  </div>
                </div>
                {(status === 'rojo' || status === 'amarillo') && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <input type="text" placeholder="Causa raiz + accion correctiva + responsable..."
                      className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy" />
                  </div>
                )}
              </div>
            )
          })}
          <button onClick={saveCurrentWeek}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all mt-2 ${saving ? 'bg-emerald-500 text-white' : 'bg-navy text-white hover:opacity-90'}`}>
            {saving ? 'Semana guardada' : 'Guardar datos de esta semana'}
          </button>
        </div>
      )}

      {view === 'historial' && (
        <div>
          {history.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-medium">Aun no hay historial</p>
              <p className="text-sm mt-1">Ingresa datos y guarda la semana para construir el historial.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse" style={{ minWidth: 500 }}>
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">KPI</th>
                    {[...history].reverse().map(h => (
                      <th key={h.weekKey} className="text-center py-3 px-2 text-xs font-semibold text-slate-500 whitespace-nowrap">{h.weekLabel}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {KPIS.map((kpi, ri) => (
                    <tr key={kpi.num} className={ri % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="py-3 px-3">
                        <p className="font-medium text-navy text-xs">{kpi.kpi}</p>
                        <p className="text-xs text-slate-400">{kpi.unit}</p>
                      </td>
                      {[...history].reverse().map(h => {
                        const val = h.data[kpi.num]
                        const status = getStatus(kpi, val, thresholds)
                        const ss = STATUS_STYLE[status]
                        return (
                          <td key={h.weekKey} className="py-3 px-2 text-center">
                            <p className="font-mono font-semibold text-navy text-sm">
                              {val !== '' && val !== undefined ? `${val}${kpi.unit === '%' ? '%' : ''}` : '—'}
                            </p>
                            <span className={`inline-block w-2 h-2 rounded-full mt-1 ${ss.dot}`} />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {view === 'tendencias' && (
        <div>
          {history.length < 2 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-3">📈</p>
              <p className="font-medium">Necesitas al menos 2 semanas de datos</p>
              <p className="text-sm mt-1">Las graficas apareceran conforme vayas ingresando semanas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {KPIS.map(kpi => {
                const hasData = history.some(h => h.data[kpi.num] !== '' && h.data[kpi.num] !== undefined)
                if (!hasData) return null
                const vals = history.filter(h => h.data[kpi.num] !== '' && h.data[kpi.num] !== undefined).map(h => Number(h.data[kpi.num]))
                const last = vals[vals.length - 1]
                const prev = vals[vals.length - 2]
                const change = prev ? ((last - prev) / prev * 100).toFixed(1) : null
                const status = getStatus(kpi, last, thresholds)
                const ss = STATUS_STYLE[status]
                const isGoodChange = change
                  ? (kpi.direction === 'up' && Number(change) > 0) || (kpi.direction === 'down' && Number(change) < 0)
                  : null

                return (
                  <div key={kpi.num} className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between cursor-pointer"
                      onClick={() => setExpandedKpi(expandedKpi === kpi.num ? null : kpi.num)}>
                      <div className="flex items-center gap-3">
                        <span className={`w-3 h-3 rounded-full flex-shrink-0 ${ss.dot}`} />
                        <div>
                          <p className="text-sm font-semibold text-navy">{kpi.kpi}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Ultimo: <span className="font-mono font-semibold text-navy">{last}{kpi.unit === '%' ? '%' : ` ${kpi.unit}`}</span>
                            {change && (
                              <span className={`ml-2 font-medium ${isGoodChange ? 'text-emerald-600' : 'text-red-500'}`}>
                                {Number(change) > 0 ? '+' : ''}{change}% vs semana anterior
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-300">{expandedKpi === kpi.num ? '↑' : '↓'}</span>
                    </div>
                    {expandedKpi === kpi.num && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <MiniChart history={history} kpiNum={kpi.num} kpi={kpi} thresholds={thresholds} />
                        <div className="flex gap-4 mt-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-dashed border-emerald-400 inline-block" /> Umbral verde</span>
                          <span className="flex items-center gap-1"><span className="w-4 border-t-2 border-dashed border-amber-400 inline-block" /> Umbral amarillo</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {view === 'umbrales' && (
        <div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
            <p className="text-sm font-semibold text-navy mb-1">Como funcionan los umbrales</p>
            <p className="text-sm text-slate-500 leading-relaxed">El semaforo se asigna automaticamente cuando ingresas un numero. Para KPIs hacia arriba: verde si supera el umbral verde, amarillo si supera el amarillo, rojo si esta por debajo. Para KPIs hacia abajo como el churn, la logica se invierte.</p>
          </div>
          <div className="space-y-3">
            {KPIS.map(kpi => {
              const t = thresholds[kpi.num] || kpi.defaultThresholds
              return (
                <div key={kpi.num} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-slate-400 w-5">{kpi.num}</span>
                    <div>
                      <p className="text-sm font-semibold text-navy">{kpi.kpi}</p>
                      <p className="text-xs text-slate-400">{kpi.unit} · {kpi.direction === 'up' ? 'Mayor es mejor' : 'Menor es mejor'}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-emerald-700 block mb-1">Umbral verde ({kpi.direction === 'up' ? '>=' : '<='})</label>
                      <div className="flex items-center border border-emerald-200 rounded-lg bg-emerald-50 overflow-hidden">
                        <input type="number" defaultValue={t.green}
                          onBlur={e => updateThreshold(kpi.num, 'green', e.target.value)}
                          className="flex-1 px-3 py-1.5 text-sm bg-transparent focus:outline-none font-mono" />
                        <span className="text-xs text-emerald-600 pr-2">{kpi.unit}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-amber-700 block mb-1">Umbral amarillo ({kpi.direction === 'up' ? '>=' : '<='})</label>
                      <div className="flex items-center border border-amber-200 rounded-lg bg-amber-50 overflow-hidden">
                        <input type="number" defaultValue={t.yellow}
                          onBlur={e => updateThreshold(kpi.num, 'yellow', e.target.value)}
                          className="flex-1 px-3 py-1.5 text-sm bg-transparent focus:outline-none font-mono" />
                        <span className="text-xs text-amber-600 pr-2">{kpi.unit}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
