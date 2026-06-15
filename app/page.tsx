'use client'
import { useState, useEffect } from 'react'
import EvaluacionTab from '@/components/EvaluacionTab'
import ChecklistTab from '@/components/ChecklistTab'
import ScorecardTab from '@/components/ScorecardTab'
import RutinaTab from '@/components/RutinaTab'
import Plan90Tab from '@/components/Plan90Tab'
import StartStopTab from '@/components/StartStopTab'
import BlindSpotsTab from '@/components/BlindSpotsTab'

const TABS = [
  { id: 'evaluacion', label: 'Evaluación Board' },
  { id: 'checklist', label: 'Checklist diario' },
  { id: 'scorecard', label: 'CEO Scorecard' },
  { id: 'rutina', label: 'Rutina semanal' },
  { id: 'plan90', label: 'Plan 90 días' },
  { id: 'startstop', label: 'Start · Stop · Continue' },
  { id: 'blindspots', label: 'Puntos ciegos' },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState('evaluacion')
  const [today, setToday] = useState('')

  useEffect(() => {
    const d = new Date()
    setToday(d.toLocaleDateString('es-GT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      {/* Top nav */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center">
                <span className="text-white text-xs font-bold">S</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-navy leading-none">Sporta · GM Dashboard</p>
                <p className="text-xs text-slate-400 leading-none mt-0.5 hidden sm:block">Carretera a El Salvador</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 hidden md:block capitalize">{today}</p>
          </div>
          {/* Tab bar */}
          <div className="flex gap-1.5 pb-3 overflow-x-auto scrollbar-none">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`nav-tab ${activeTab === t.id ? 'active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'evaluacion' && <EvaluacionTab />}
        {activeTab === 'checklist' && <ChecklistTab />}
        {activeTab === 'scorecard' && <ScorecardTab />}
        {activeTab === 'rutina' && <RutinaTab />}
        {activeTab === 'plan90' && <Plan90Tab />}
        {activeTab === 'startstop' && <StartStopTab />}
        {activeTab === 'blindspots' && <BlindSpotsTab />}
      </main>
    </div>
  )
}
