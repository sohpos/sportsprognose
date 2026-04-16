'use client';

import { useSeasonPredictor } from "@/hooks/useSeasonPredictor"
import { SeasonXPTable } from "./SeasonXPTable"
import { SeasonChances } from "./SeasonChances"
import { PositionDistributionChart } from "./PositionDistributionChart"
import { TeamSummaryGrid } from "./TeamSummaryGrid"
import { SurpriseIndex } from "./SurpriseIndex"
import { LeagueInsightsPanel } from "./LeagueInsightsPanel"
import { ScatterPlotXPvsActual } from "./ScatterPlotXPvsActual"

type SeasonPredictorPageProps = {
  fixtures?: any[]
  teams: { id: string; name: string; logo?: string }[]
  actualPoints?: Record<string, number>
  initialData?: Record<string, {
    xp: number
    first: number
    relegation: number
    distribution: number[]
    goalsFor?: number
    goalsAgainst?: number
    xG?: number
    xGA?: number
    form?: number[]
    homePoints?: number
    awayPoints?: number
  }>
}

export function SeasonPredictorPage({ fixtures, teams, actualPoints, initialData }: SeasonPredictorPageProps) {
  const useDirectData = !!initialData
  
  const { data: simulatedData, loading, progress } = useSeasonPredictor(
    useDirectData ? [] : fixtures || [], 
    useDirectData ? [] : teams as any
  )
  
  const data = initialData || simulatedData

  if (!useDirectData && (loading || !data)) {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-2xl font-bold text-white">Season Predictor</h1>
        <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow-lg">
          <p className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">
            Simulation läuft ({progress}% von 100.000 Iterationen)…
          </p>
          <div className="h-2 w-full rounded bg-neutral-200 dark:bg-neutral-800">
            <div
              className="h-2 rounded bg-blue-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="rounded-xl bg-white dark:bg-neutral-900 p-6 shadow-lg text-center text-neutral-500">
        Keine Daten verfügbar
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* xP Table */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Expected Points</h2>
        <SeasonXPTable data={data} teams={teams} />
      </section>
      
      {/* Season Chances */}
      <section>
        <SeasonChances data={data} teams={teams} />
      </section>

      {/* Surprise Index */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Surprise Index</h2>
        <SurpriseIndex data={data as any} teams={teams} />
      </section>

      {/* Position Distribution & Scatter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h2 className="text-lg font-bold text-white mb-3">Positionsverteilung</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.slice(0, 6).map((t) => (
              <PositionDistributionChart
                key={t.id}
                team={t}
                distribution={data?.[t.id]?.distribution || []}
              />
            ))}
          </div>
        </section>
        
        <section>
          <ScatterPlotXPvsActual 
            teams={teams}
            data={Object.fromEntries(
              Object.entries(data || {}).map(([id, d]: [string, any]) => [
                id,
                {
                  xp: d.xp,
                  actualPoints: actualPoints?.[id] || d.xp,
                  surprise: (actualPoints?.[id] || d.xp) - d.xp
                }
              ])
            )}
          />
        </section>
      </div>

      {/* League Insights */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Liga Insights</h2>
        <LeagueInsightsPanel data={data as any} teams={teams} />
      </section>

      {/* Team Summary Grid */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Alle Teams</h2>
        <TeamSummaryGrid data={data} teams={teams} />
      </section>
    </div>
  )
}