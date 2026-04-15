'use client';

import { useSeasonPredictor } from "@/hooks/useSeasonPredictor"
import { SeasonXPTable } from "./SeasonXPTable"
import { SeasonChances } from "./SeasonChances"
import { PositionDistributionChart } from "./PositionDistributionChart"
import { TeamSummaryGrid } from "./TeamSummaryGrid"
import { SurpriseIndex } from "./SurpriseIndex"

type SeasonPredictorPageProps = {
  fixtures: any[]
  teams: { id: string; name: string }[]
  actualPoints?: Record<string, number>
}

export function SeasonPredictorPage({ fixtures, teams, actualPoints }: SeasonPredictorPageProps) {
  const { data, loading, progress } = useSeasonPredictor(fixtures, teams)

  if (loading || !data) {
    return (
      <div className="space-y-4 p-6">
        <h1 className="text-2xl font-bold">Season Predictor</h1>
        <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow">
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

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-2xl font-bold">Season Predictor</h1>

      <SeasonXPTable data={data} teams={teams} />

      <SeasonChances data={data} teams={teams} />

      <SurpriseIndex data={data} teams={teams} actualPoints={actualPoints} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams.map((t) => (
          <PositionDistributionChart
            key={t.id}
            team={t}
            distribution={data[t.id].distribution}
          />
        ))}
      </div>

      <TeamSummaryGrid data={data} teams={teams} />
    </div>
  )
}