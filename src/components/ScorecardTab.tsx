'use client'
import { useState, useEffect } from 'react'
import { KPIS } from '@/data/content'

type Status = 'verde' | 'amarillo' | 'rojo' | null
type ViewMode = 'semanal' | 'historial' | 'umbrales' 

const MONTHLY_KPIS = [3, 4, 6, 10]
const MONTH_NAMES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const DEFAULT_UMBRALES: Record<number, { verde: string; amarillo: string; unidad: string; mayorEsMejor: boolean }> = {
  1: { verde: '3', amarillo: '5', unidad: '%', mayorEsMejor: false },
  2: { verde: '20', amarillo: '10', unidad: 'membresías', mayorEsMejor: true },
  3: { verde: '85', amarillo: '75', unidad: '%', mayorEsMejor: true },
  4: { verde: '70', amarillo: '50', unidad: '%', mayorEsMejor: true },
  5: { verde: '100', amarillo: '90', unidad: '% vs presupuesto', mayorEsMejor: true },
  6: { verde: '20', amarillo: '10', unidad: '%', mayorEsMejor: true },
  7: { verde: '30', amarillo: '20', unidad: '%', mayorEsMejor: true },
  8: { verde: '40', amarillo: '25', unidad: '%', mayorEsMejor: true },
  9: { verde: '80', amarillo: '60', unidad: '%', mayorEsMejor: true },
  10: { verde: '5000', amarillo: '2000', unidad: 'Q', mayorEsMejor: true },
}

const wk = () => { const d = new Date(); return `sc-${d.getFullYear()}-${d.getMonth()}-w${Math.ceil(d.getDate()/7)}` }
const mk = () => { const d = new Date(); return `sc-m-${d.getFullYear()}-${d.getMonth()}` }

const read = (k: string): Record<string, string> => {
  try { return JSON.parse(localStorage.getItem(k) || '{}') } catch { return {} }
}
const write = (k: string, num: number, v: string) => {
  const c = read(k); c[String(num)] = v; localStorage.setItem(k, JSON.stringify(c))
}

const pastWeeks = (): string[] => {
  const result: string[] = []; const seen: Record<string,boolean> = {}; const now = new Date()
  for(let i=0;i<12;i++){
    const d = new Date(now); d.setDate(d.getDate()-i*7)
    const k = `sc-${d.getFullYear()}-${d.getMonth()}-w${Math.ceil(d.getDate()/7)}`
    if(!seen[k]){seen[k]=true;result.push(k)}
  }
  return result
}
const pastMonths = (): string[] => {
  const result: string[] = []; const now = new Date()
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

const calcStatus = (valor: string, num: number, umbrales: typeof DEFAULT_UMBRALES): Status => {
  const v = parseFloat(valor.replace(',','.').replace('%','').trim())
  if(isNaN(v)) return null
  const u = umbrales[num]
  if(!u) return null
  const verde = parseFloat(u.verde)
  const amarillo = parseFloat(u.amarillo)
  if(u.mayorEsMejor){
    if(v >= verde) return 'verde'
    if(v >= amarillo) return 'amarillo'
    return 'rojo'
  } else {
    if(v <= verde) return 'verde'
    if(v <= amarillo) return 'amarillo'
    return 'rojo'
  }
}

export default function ScorecardTab() {
  const [view, setView] = useState<ViewMode>('semanal')
  const [tick, setTick] = useState(0)
  const [hwk, setHwk] = useState('')
  const [hmk, setHmk] = useState('')
  const [umbrales, setUmbrales] = useState(DEFAULT_UMBRALES)

  useEffect(() => {
    const wks = pastWeeks(); const mks = pastMonths()
    setHwk(wks[1]||wks[0]||''); setHmk(mks[1]||mks[0]||'')
    const saved = localStorage.getItem('sc-umbrales')
    if(saved) { try { setUmbrales(JSON.parse(saved)) } catch {} }
  }, [])

  const refresh = () => setTick(t => t+1)

  const saveUmbrales = (u: typeof DEFAULT_UMBRALES) => {
    setUmbrales(u); localStorage.setItem('sc-umbrales', JSON.stringify(u)); refresh()
  }

  const getStatus = (storKey: string, num: number): Status => {
    const manual = read(storKey+'-s')[String(num)]
    if(manual) return manual as Status
    const valor = read(storKey+'-v')[String(num)] || ''
    if(valor) return calcStatus(valor, num, umbrales)
    return null
  }

  const currentWk = wk(); const currentMk = mk()
  const allStatuses = KPIS.map(k => {
    const key = MONTHLY_KPIS.includes(k.num) ? currentMk : currentWk
    return getStatus(key, k.num)
  })
  const verde = allStatuses.filter(s=>s==='verde').length
  const amarillo = allStatuses.filter(s=>s==='amarillo').length
  const rojo = allStatuses.filter(s=>s==='rojo').length

  const btnBase = 'px-3 py-1 rounded-full text-xs font-medium border transition-all '
  const btn = (val: 'verde'|'amarillo'|'rojo', current: Status) => {
    if(val==='verde') return btnBase+(current==='verde'?'bg-accent text-white border-accent':'border-border text-slate-500 hover:border-accent hover:text-accent')
    if(val==='amarillo') return btnBase+(current==='amarillo'?'bg-amber text-white border-amber':'border-border text-slate-500 hover:border-amber hover:text-amber')
    return btnBase+(current==='rojo'?'bg-danger text-white border-danger':'border-border text-slate-500 hover:border-danger hover:text-danger')
  }

  const tabBtn = (mode: ViewMode, label: string) => (
    <button onClick={()=>setView(mode)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${view===mode?'bg-navy text-white border-navy':'border-border text-slate-500 hover:border-navy hover:text-navy'}`}>{label}</button>
  )

  const KpiCard = ({kpiNum, kpiName, dimension, frecuencia, porque, storKey}: {kpiNum: number; kpiName: string; dimension: string; frecuencia: string; porque: string; storKey: string}) => {
    const [localValor, setLocalValor] = useState(read(storKey+'-v')[String(kpiNum)]||'')
    const [localNota, setLocalNota] = useState(read(storKey+'-n')[String(kpiNum)]||'')
    const status = getStatus(storKey, kpiNum)
    const manualOverride = read(storKey+'-s')[String(kpiNum)] as Status || null

    const handleValorChange = (v: string) => {
      setLocalValor(v)
      write(storKey+'-v', kpiNum, v)
      // clear manual override so auto-calc takes over
      const s = read(storKey+'-s')
      delete s[String(kpiNum)]
      localStorage.setItem(storKey+'-s', JSON.stringify(s))
      refresh()
    }

    const handleToggle = (val: 'verde'|'amarillo'|'rojo') => {
      const s = read(storKey+'-s')
      if(s[String(kpiNum)]===val) { delete s[String(kpiNum)] } else { s[String(kpiNum)]=val }
      localStorage.setItem(storKey+'-s', JSON.stringify(s))
      refresh()
    }

    const isMonthly = MONTHLY_KPIS.includes(kpiNum)

    return (
      <div key={`${kpiNum}-${storKey}-${tick}`} className={`card transition-all ${status==='rojo'?'border-danger/30':status==='amarillo'?'border-amber/30':status==='verde'?'border-accent/30':''}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-surface text-navy text-xs font-bold flex items-center justify-center flex-shrink-0">{kpiNum}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-navy text-sm">{kpiName}</p>
            <p className="text-xs text-slate-400 mt-0.5">{dimension} · {isMonthly?<span className="text-amber font-medium">Mensual</span>:frecuencia} · {porque}</p>
            {umbrales[kpiNum] && (
              <p className="text-xs text-slate-300 mt-0.5">
                Verde {umbrales[kpiNum].mayorEsMejor?'≥':'≤'}{umbrales[kpiNum].verde}{umbrales[kpiNum].unidad} · Amarillo {umbrales[kpiNum].mayorEsMejor?'≥':'≤'}{umbrales[kpiNum].amarillo}{umbrales[kpiNum].unidad}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              placeholder={umbrales[kpiNum]?.unidad||'Valor'}
              value={localValor}
              onChange={e=>handleValorChange(e.target.value)}
              className="w-24 text-sm border border-border rounded-lg px-2 py-1 text-center text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy"
            />
            <div className="flex gap-1.5">
              <button onClick={()=>handleToggle('verde')} className={btn('verde', manualOverride||status)}>Verde</button>
              <button onClick={()=>handleToggle('amarillo')} className={btn('amarillo', manualOverride||status)}>Amarillo</button>
              <button onClick={()=>handleToggle('rojo')} className={btn('rojo', manualOverride||status)}>Rojo</button>
            </div>
          </div>
        </div>
        {(status==='rojo'||status==='amarillo')&&(
          <div className="mt-3 pt-3 border-t border-slate-100">
            <input
              type="text"
              placeholder="Causa raíz + acción correctiva + responsable..."
              value={localNota}
              onChange={e=>{setLocalNota(e.target.value);write(storKey+'-n',kpiNum,e.target.value)}}
              className="w-full text-sm border border-border rounded-lg px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-navy"
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <p className="section-header">Revisión cada lunes antes de las 9:00 AM</p>
        <h1 className="text-2xl font-semibold text-navy">CEO Scorecard</h1>
        <p className="text-sm text-slate-500 mt-1">El semáforo se asigna automáticamente al ingresar el valor. Puedes sobreescribirlo manualmente.</p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {tabBtn('semanal','Semana actual')}
        {tabBtn('historial','Historial')}
        {tabBtn('umbrales','⚙ Umbrales')}
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
              <KpiCard key={`s-${k.num}-${currentWk}-${tick}`} kpiNum={k.num} kpiName={k.kpi} dimension={k.dimension} frecuencia={k.frecuencia} porque={k.porque} storKey={currentWk}/>
            ))}
          </div>

          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">KPIs Mensuales · {MONTH_NAMES[new Date().getMonth()]}</p>
          <div className="space-y-3 mb-6">
            {KPIS.filter(k=>MONTHLY_KPIS.includes(k.num)).map(k=>(
              <KpiCard key={`m-${k.num}-${currentMk}-${tick}`} kpiNum={k.num} kpiName={k.kpi} dimension={k.dimension} frecuencia={k.frecuencia} porque={k.porque} storKey={currentMk}/>
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
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <p className="text-sm font-semibold text-navy">Semana:</p>
              <select value={hwk} onChange={e=>setHwk(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy">
                {pastWeeks().map(k=><option key={k} value={k}>{weekLabel(k)}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {KPIS.filter(k=>!MONTHLY_KPIS.includes(k.num)).map(k=>(
                <KpiCard key={`hw-${k.num}-${hwk}-${tick}`} kpiNum={k.num} kpiName={k.kpi} dimension={k.dimension} frecuencia={k.frecuencia} porque={k.porque} storKey={hwk}/>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <p className="text-sm font-semibold text-navy">Mes:</p>
              <select value={hmk} onChange={e=>setHmk(e.target.value)} className="text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy">
                {pastMonths().map(k=><option key={k} value={k}>{monthLabel(k)}</option>)}
              </select>
            </div>
            <div className="space-y-3">
              {KPIS.filter(k=>MONTHLY_KPIS.includes(k.num)).map(k=>(
                <KpiCard key={`hm-${k.num}-${hmk}-${tick}`} kpiNum={k.num} kpiName={k.kpi} dimension={k.dimension} frecuencia={k.frecuencia} porque={k.porque} storKey={hmk}/>
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
                      {pastWeeks().slice(0,8).reverse().map(wkey=>{
                        const s = getStatus(wkey, k.num)
                        const v = read(wkey+'-v')[String(k.num)]||''
                        return <td key={wkey} className="text-center py-2 px-1"><div>{dot(s)}</div>{v&&<div className="text-slate-400">{v}</div>}</td>
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
                      {pastMonths().slice(0,6).reverse().map(mkey=>{
                        const s = getStatus(mkey, k.num)
                        const v = read(mkey+'-v')[String(k.num)]||''
                        return <td key={mkey} className="text-center py-2 px-1"><div>{dot(s)}</div>{v&&<div className="text-slate-400">{v}</div>}</td>
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view==='umbrales'&&(
        <div>
          <p className="text-sm text-slate-500 mb-6">Define los umbrales para cada KPI. El semáforo se asigna automáticamente al ingresar el valor numérico.</p>
          <div className="space-y-3">
            {KPIS.map(k=>{
              const u = umbrales[k.num]
              if(!u) return null
              return (
                <div key={k.num} className="card">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-medium text-navy text-sm">{k.kpi}</p>
                      <p className="text-xs text-slate-400">{k.dimension}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Mayor es mejor</span>
                      <button
                        onClick={()=>saveUmbrales({...umbrales,[k.num]:{...u,mayorEsMejor:!u.mayorEsMejor}})}
                        className={`w-10 h-5 rounded-full transition-all ${u.mayorEsMejor?'bg-accent':'bg-slate-200'} relative`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${u.mayorEsMejor?'left-5':'left-0.5'}`}/>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">🟢 Verde {u.mayorEsMejor?'≥':'≤'}</label>
                      <input type="text" value={u.verde}
                        onChange={e=>saveUmbrales({...umbrales,[k.num]:{...u,verde:e.target.value}})}
                        className="w-full text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-accent"/>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">🟡 Amarillo {u.mayorEsMejor?'≥':'≤'}</label>
                      <input type="text" value={u.amarillo}
                        onChange={e=>saveUmbrales({...umbrales,[k.num]:{...u,amarillo:e.target.value}})}
                        className="w-full text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-amber"/>
                    </div>
                    <div>
                      <label className="text-xs text-slate-400 mb-1 block">Unidad</label>
                      <input type="text" value={u.unidad}
                        onChange={e=>saveUmbrales({...umbrales,[k.num]:{...u,unidad:e.target.value}})}
                        className="w-full text-sm border border-border rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-navy"/>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 p-4 bg-surface rounded-xl border border-border">
            <p className="text-xs font-semibold text-navy mb-1">Cómo funciona</p>
            <p className="text-xs text-slate-500">Al ingresar un número en cualquier KPI, el semáforo se asigna automáticamente. Si quieres sobreescribirlo, haz clic en Verde/Amarillo/Rojo manualmente. Los umbrales se guardan automáticamente.</p>
          </div>
        </div>
      )}
    </div>
  )
}
