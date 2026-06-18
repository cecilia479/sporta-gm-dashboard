'use client'
import { useState, useEffect } from 'react'
import { KPIS } from '@/data/content'

type Status = 'verde' | 'amarillo' | 'rojo' | null
type ViewMode = 'semanal' | 'historial'

const MONTHLY_KPIS = [3, 4, 6, 10]
const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const weekKey = () => {
  const d = new Date()
  return `sc-${d.getFullYear()}-${d.getMonth()}-w${Math.ceil(d.getDate()/7)}`
}
const monthKey = () => {
  const d = new Date()
  return `sc-m-${d.getFullYear()}-${d.getMonth()}`
}
const read = (k: string): Record<string,string> => {
  try { return JSON.parse(localStorage.getItem(k)||'{}') } catch { return {} }
}
const write = (k: string, num: number, v: string) => {
  const c = read(k); c[num]=v; localStorage.setItem(k,JSON.stringify(c))
}

const pastWeeks = (): string[] => {
  const result: string[] = []
  const seen: Record<string,boolean> = {}
  const now = new Date()
  for(let i=0;i<12;i++){
    const d = new Date(now); d.setDate(d.getDate()-i*7)
    const k = `sc-${d.getFullYear()}-${d.getMonth()}-w${Math.ceil(d.getDate()/7)}`
    if(!seen[k]){seen[k]=true;result.push(k)}
  }
  return result
}
const pastMonths = (): string[] => {
  const result: string[] = []
  const now = new Date()
  for(let i=0;i<12;i++){
    const d = new Date(now.getFullYear(),now.getMonth()-i,1)
    result.push(`sc-m-${d.getFullYear()}-${d.getMonth()}`)
  }
  return result
}
const weekLabel = (k: string) => {
  const m = k.match(/sc-(\d+)-(\d+)-w(\d+)/)
  return m ? `Sem ${m[3]} · ${MONTH_NAMES[parseInt(m[2])]} ${m[1]}` : k
}
const monthLabel = (k: string) => {
  const p = k.replace('sc-m-','').split('-')
  return `${MONTH_NAMES[parseInt(p[1])]} ${p[0]}`
}
const dot = (s: Status) => s==='verde'?'🟢':s==='amarillo'?'🟡':s==='rojo'?'🔴':'⚪'

type KpiRow = { num: number; kpi: string; dimension: string; frecuencia: string; porque: string }

function KpiCard({k, storKey, onSave}: {k: KpiRow; storKey: string; onSave: ()=>void}) {
  const s = read(storKey+'-s')
  const n = read(storKey+'-n')
  const v = read(storKey+'-v')
  const status = (s[k.num] || null) as Status
  const nota = n[k.num] || ''
  const valor = v[k.num] || ''

  const toggle = (val: 'verde'|'amarillo'|'rojo') => {
    const cur = read(storKey+'-s')
    cur[k.num] = cur[k.num]===val ? '' : val
    localStorage.setItem(storKey+'-s', JSON.stringify(cur))
    onSave()
  }

  const base = 'px-3 py-1 rounded-full text-xs font-medium border transition-all '
  const btn = (val: 'verde'|'amarillo'|'rojo') => {
    if(val==='verde') return base+(status==='verde'?'bg-accent text-white border-accent':'border-border text-slate-500 hover:border-accent hover:text-accent')
    if(val==='amarillo') return base+(status==='amarillo'?'bg-amber text-white border-amber':'border-border text-slate-500 hover:border-amber hover:text-amber')
    return base+(status==='rojo'?'bg-danger text-white border-danger':'border-border text-slate-500 hover:border-danger hover:text-danger')
  }

  return (
    <div className={`card transition-all ${status==='rojo'?'border-danger/30':status==='amarillo'?'border-amber/30':status==='verde'?'border-accent/30':''}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <span className="w-6 h-6 rounded-full bg-surface text-navy text-xs font-bold flex items-center justify-center flex-shrink-0">{k.num}</span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-navy text-sm">{k.kpi}</p>
          <p className="text-xs text-slate-400 mt-0.5">{k.dimension} · {k.frecuencia} · {k.porque}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <input type="text" placeholder="Valor" defaultValue={valor}
            onBlur={e=>{write(storKey+'-v',k.num,e.target.value);onSave()}}
            className="w-20 text-sm border border-border rounded-lg px-2 py-1 text-center text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy"/>
          <div className="flex gap-1.5">
            <button onClick={()=>toggle('verde')} className={btn('verde')}>Verde</button>
            <button onClick={()=>toggle('amarillo')} className={btn('amarillo')}>Amarillo</button>
            <button onClick={()=>toggle('rojo')} className={btn('rojo')}>Rojo</button>
          </div>
        </div>
      </div>
      {(status==='rojo'||status==='amarillo')&&(
        <div className="mt-3 pt-3 border-t border-slate-100">
          <input type="text" placeholder="Causa raíz + acción correctiva + responsable..." defaultValue={nota}
            onBlur={e=>{write(storKey+'-n',k.num,e.target.value);onSave()}}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy"/>
        </div>
      )}
    </div>
  )
}

export default function ScorecardTab() {
  const [view, setView] = useState<ViewMode>('semanal')
  const [tick, setTick] = useState(0)
  const [hwk, setHwk] = useState('')
  const [hmk, setHmk] = useState('')

  useEffect(()=>{
    const wks = pastWeeks()
    const mks = pastMonths()
    setHwk(wks[1]||wks[0]||'')
    setHmk(mks[1]||mks[0]||'')
  },[])

  const refresh = () => setTick(t=>t+1)

  const wk = weekKey()
  const mk = monthKey()

  const allStatuses = KPIS.map(k=>{
    const key = MONTHLY_KPIS.includes(k.num)?mk:wk
    return (read(key+'-s')[k.num]||null) as Status
  })
  const verde = allStatuses.filter(s=>s==='verde').length
  const amarillo = allStatuses.filter(s=>s==='amarillo').length
  const rojo = allStatuses.filter(s=>s==='rojo').length

  const tabBtn = (mode: ViewMode, label: string) => (
    <button onClick={()=>setView(mode)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${view===mode?'bg-navy text-white border-navy':'border-border text-slate-500 hover:border-navy hover:text-navy'}`}>{label}</button>
  )

  return (
    <div>
      <div className="mb-6">
        <p className="section-header">Revisión cada lunes antes de las 9:00 AM</p>
        <h1 className="text-2xl font-semibold text-navy">CEO Scorecard</h1>
        <p className="text-sm text-slate-500 mt-1">Los datos se guardan automáticamente por semana y mes.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {tabBtn('semanal','Semana actual')}
        {tabBtn('historial','Ingresar historial')}
      </div>

      {view==='semanal'&&(
        <>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="card-sm text-center"><p className="text-3xl font-bold text-accent">{verde}</p><p className="text-xs text-slate-500 mt-1">Verde</p></div>
            <div className="card-sm text-center"><p className="text-3xl font-bold text-amber">{amarillo}</p><p className="text-xs text-slate-500 mt-1">Amarillo</p></div>
            <div className="card-sm text-center"><p className="text-3xl font-bold text-danger">{rojo}</p><p className="text-xs text-slate-500 mt-1">Rojo</p></div>
          </div>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">KPIs Semanales</p>
          <div className="space-y-3 mb-6">
            {KPIS.filter(k=>!MONTHLY_KPIS.includes(k.num)).map(k=>(
              <KpiCard key={`${k.num}-${tick}`} k={k} storKey={wk} onSave={refresh}/>
            ))}
          </div>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">KPIs Mensuales · {MONTH_NAMES[new Date().getMonth()]}</p>
          <div className="space-y-3 mb-6">
            {KPIS.filter(k=>MONTHLY_KPIS.includes(k.num)).map(k=>(
              <KpiCard key={`${k.num}-${tick}`} k={k} storKey={mk} onSave={refresh}/>
            ))}
          </div>

          <div className="mt-6 p-4 bg-surface rounded-xl border border-border">
            <p className="text-xs font-semibold text-navy mb-1">Regla clave</p>
            <p className="text-xs text-slate-500">"No sé por qué" no es una respuesta aceptable para un KPI rojo. Todo indicador rojo necesita causa raíz, acción concreta y responsable nombrado antes de cerrar la reunión del lunes.</p>
          </div>
        </>
      )}

      {view==='historial'&&(
        <div>
          <p className="text-sm text-slate-500 mb-6">Ingresa datos de semanas y meses anteriores para construir tu historial.</p>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-semibold text-navy">Semana:</p>
              <select value={hwk} onChange={e=>setHwk(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy">
                {pastWeeks().map(k=><option key={k} value={k}>{weekLabel(k)}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {KPIS.filter(k=>!MONTHLY_KPIS.includes(k.num)).map(k=>(
                <KpiCard key={`h-${k.num}-${hwk}-${tick}`} k={k} storKey={hwk} onSave={refresh}/>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <p className="text-sm font-semibold text-navy">Mes:</p>
              <select value={hmk} onChange={e=>setHmk(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy">
                {pastMonths().map(k=><option key={k} value={k}>{monthLabel(k)}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {KPIS.filter(k=>MONTHLY_KPIS.includes(k.num)).map(k=>(
                <KpiCard key={`h-${k.num}-${hmk}-${tick}`} k={k} storKey={hmk} onSave={refresh}/>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-navy mb-4">Tendencias — últimas 8 semanas</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left text-slate-500 font-medium py-2 pr-3 min-w-[120px]">KPI</th>
                    {pastWeeks().slice(0,8).reverse().map(k=>(
                      <th key={k} className="text-center text-slate-400 font-normal py-2 px-1 min-w-[55px]">{weekLabel(k).split('·')[0].trim()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {KPIS.filter(k=>!MONTHLY_KPIS.includes(k.num)).map(k=>(
                    <tr key={k.num} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-600 font-medium">{k.kpi}</td>
                      {pastWeeks().slice(0,8).reverse().map(wk=>{
                        const s = (read(wk+'-s')[k.num]||null) as Status
                        const v = read(wk+'-v')[k.num]||''
                        return <td key={wk} className="text-center py-2 px-1"><div>{dot(s)}</div>{v&&<div className="text-slate-400">{v}</div>}</td>
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
                    {pastMonths().slice(0,6).reverse().map(k=>(
                      <th key={k} className="text-center text-slate-400 font-normal py-2 px-1 min-w-[70px]">{monthLabel(k)}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {KPIS.filter(k=>MONTHLY_KPIS.includes(k.num)).map(k=>(
                    <tr key={k.num} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-600 font-medium">{k.kpi}</td>
                      {pastMonths().slice(0,6).reverse().map(mk=>{
                        const s = (read(mk+'-s')[k.num]||null) as Status
                        const v = read(mk+'-v')[k.num]||''
                        return <td key={mk} className="text-center py-2 px-1"><div>{dot(s)}</div>{v&&<div className="text-slate-400">{v}</div>}</td>
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
