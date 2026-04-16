import { TeamInsightCard } from "./TeamInsightCard";
import { PositionDistributionChart } from "./PositionDistributionChart";
import { calculateExpectedPosition } from "./utils";

type TeamDetailPageProps = {
  team: { id: string; name: string; logo?: string };
  data: {
    xp: number;
    distribution: number[];
    actualPoints?: number;
    goalsFor?: number;
    goalsAgainst?: number;
    xG?: number;
    xGA?: number;
    form?: number[];
    homePoints?: number;
    awayPoints?: number;
  };
  leagueAverage?: { xp: number; xG: number; xGA: number };
};

export function TeamDetailPage({ team, data, leagueAverage }: TeamDetailPageProps) {
  // Volatility fix: total only once
  const total = data?.distribution?.reduce((a, b) => a + b, 0) ?? 0;

  const volatility =
    total > 0
      ? Math.sqrt(
          data.distribution.reduce((sum, count, pos) => {
            const prob = count / total;
            const mean =
              data.distribution.reduce((s, c, i) => s + c * (i + 1), 0) / total;
            return sum + prob * Math.pow(pos + 1 - mean, 2);
          }, 0)
        )
      : 0;

  const xp = data?.xp ?? 0;
  const actual = data?.actualPoints ?? null;
  const delta = actual !== null ? actual - xp : null;

  const xgDelta =
    data?.goalsFor !== undefined && data?.xG !== undefined
      ? data.goalsFor - data.xG
      : null;

  const xgaDelta =
    data?.goalsAgainst !== undefined && data?.xGA !== undefined
      ? data.goalsAgainst - data.xGA
      : null;

  const formHistory = data?.form?.slice(-10) || [];
  const formPoints = formHistory.map((r, i) => ({
    match: i + 1,
    points: r,
    height: (r / 3) * 100,
  }));

  const expectedPosition =
    data?.distribution ? calculateExpectedPosition(data.distribution) : 0;

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        {team.logo && (
          <img
            src={team.logo}
            alt={team.name}
            className="w-12 h-12 rounded-lg object-contain bg-white dark:bg-neutral-800 p-1"
          />
        )}
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            {team.name}
          </h1>
          {actual !== null && (
            <p className="text-neutral-500 dark:text-neutral-400">
              {actual} Punkte • Erwartete Position: {expectedPosition.toFixed(1)}.
            </p>
          )}
        </div>
      </div>

      {/* Team Insight Card */}
      <TeamInsightCard team={team} data={data} compact={false} />

      {/* Position Distribution */}
      <div className="max-w-md">
        <h2 className="text-lg font-bold mb-3 text-neutral-800 dark:text-neutral-200">
          Positionsverteilung
        </h2>
        <PositionDistributionChart
          team={team}
          distribution={data?.distribution || []}
        />
      </div>

      {/* Form Curve */}
      {formHistory.length > 0 && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow-lg">
          <h2 className="text-base font-bold mb-3 text-neutral-800 dark:text-neutral-200">
            Formkurve (letzte 10)
          </h2>
          <div className="flex items-end gap-1 h-24">
            {formPoints.map((f, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all ${
                    f.points >= 3
                      ? "bg-green-500"
                      : f.points >= 1
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                  style={{ height: `${f.height}%` }}
                />
                <span className="text-[10px] text-neutral-400">{f.points}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-neutral-400 mt-2">
            <span>älteste</span>
            <span>neueste</span>
          </div>
        </div>
      )}

      {/* xG/xGA Breakdown */}
      {(data?.xG !== undefined || data?.xGA !== undefined) && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow-lg">
          <h2 className="text-base font-bold mb-3 text-neutral-800 dark:text-neutral-200">
            xG Breakdown
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {data?.xG !== undefined && (
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  Expected Goals (xG)
                </p>
                <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                  {data.xG.toFixed(1)}
                </p>
                {xgDelta !== null && (
                  <p
                    className={`text-sm ${
                      xgDelta >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {xgDelta >= 0 ? "+" : ""}
                    {xgDelta.toFixed(1)} vs. Tore
                  </p>
                )}
              </div>
            )}

            {data?.xGA !== undefined && (
              <div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                  Expected Goals Against (xGA)
                </p>
                <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                  {data.xGA.toFixed(1)}
                </p>
                {xgaDelta !== null && (
                  <p
                    className={`text-sm ${
                      xgaDelta <= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {xgaDelta >= 0 ? "+" : ""}
                    {xgaDelta.toFixed(1)} vs. Gegentore
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Home/Away Split */}
      {data?.homePoints !== undefined && data?.awayPoints !== undefined && (
        <div className="rounded-xl bg-white dark:bg-neutral-900 p-4 shadow-lg">
          <h2 className="text-base font-bold mb-3 text-neutral-800 dark:text-neutral-200">
            Heim / Auswärts
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
              <p className="text-xs text-neutral-500 mb-1">Heim</p>
              <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                {data.homePoints}
              </p>
            </div>
            <div className="text-center p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800">
              <p className="text-xs text-neutral-500 mb-1">Auswärts</p>
              <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
                {data.awayPoints}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
