'use client';

// apps/web/hooks/useSeasonPredictor.ts
import { useEffect, useState, useRef, useCallback } from 'react';

interface Team {
  id: string;
  name: string;
  attack: number;
  defense: number;
  homeAdvantage: number;
}

interface Match {
  homeId: string;
  awayId: string;
}

interface SeasonResult {
  xp: number;
  first: number;
  relegation: number;
  top4: number;
  top6: number;
  distribution: number[];
}

interface UseSeasonPredictorResult {
  data: Record<string, SeasonResult> | null;
  loading: boolean;
  progress: number;
  error: string | null;
}

export function useSeasonPredictor(
  teams: Team[],
  matches: Match[]
): UseSeasonPredictorResult {
  const [data, setData] = useState<Record<string, SeasonResult> | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const runSimulation = useCallback(() => {
    if (!teams.length || !matches.length) return;

    // Clean up existing worker
    if (workerRef.current) {
      workerRef.current.terminate();
    }

    setLoading(true);
    setProgress(0);
    setError(null);

    const totalIterations = 100000;
    const batchSize = 10000;
    const batches = totalIterations / batchSize;

    try {
      const worker = new Worker('/workers/seasonWorker.js');
      workerRef.current = worker;

      let aggregated: Record<string, SeasonResult> | null = null;
      let received = 0;

      worker.onmessage = (event: MessageEvent) => {
        const { results, iterations } = event.data as {
          results: Record<string, SeasonResult>;
          iterations: number;
        };

        if (!aggregated) {
          aggregated = results;
        } else {
          // Aggregate results
          for (const id of Object.keys(results)) {
            aggregated[id].xp += results[id].xp;
            aggregated[id].first += results[id].first;
            aggregated[id].relegation += results[id].relegation;
            aggregated[id].top4 += results[id].top4;
            aggregated[id].top6 += results[id].top6;
            aggregated[id].distribution = aggregated[id].distribution.map(
              (v, idx) => v + results[id].distribution[idx]
            );
          }
        }

        received++;
        setProgress(Math.round((received / batches) * 100));

        if (received === batches) {
          // Normalize results
          if (aggregated) {
            for (const id of Object.keys(aggregated)) {
              aggregated[id].xp = Math.round(aggregated[id].xp / totalIterations * 10) / 10;
              aggregated[id].first = Math.round(aggregated[id].first / totalIterations * 1000) / 10;
              aggregated[id].relegation = Math.round(aggregated[id].relegation / totalIterations * 1000) / 10;
              aggregated[id].top4 = Math.round(aggregated[id].top4 / totalIterations * 1000) / 10;
              aggregated[id].top6 = Math.round(aggregated[id].top6 / totalIterations * 1000) / 10;
              aggregated[id].distribution = aggregated[id].distribution.map(
                v => Math.round(v / totalIterations * 1000) / 10
              );
            }
          }

          setData(aggregated);
          setLoading(false);
          worker.terminate();
        }
      };

      worker.onerror = (err) => {
        console.error('Worker error:', err);
        setError('Simulation failed');
        setLoading(false);
      };

      // Send batch jobs
      for (let i = 0; i < batches; i++) {
        worker.postMessage({ fixtures: matches, teams, iterations: batchSize });
      }
    } catch (err) {
      console.error('Failed to start worker:', err);
      setError('Failed to start simulation');
      setLoading(false);
    }
  }, [teams, matches]);

  useEffect(() => {
    runSimulation();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [runSimulation]);

  return { data, loading, progress, error };
}
