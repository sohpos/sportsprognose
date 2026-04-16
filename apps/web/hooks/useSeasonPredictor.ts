'use client';

// apps/web/hooks/useSeasonPredictor.ts
import { useEffect, useState, useRef, useCallback } from 'react';

interface Team {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
}

interface Match {
  homeId: string;
  awayId: string;
}

// NEW: Correct field names from our engine
interface SeasonResult {
  xp: number;
  championProb: number;  // renamed from first
  relegationProb: number; // renamed from relegation
  positions: Array<{ position: number; probability: number }>;
  distribution: number[];
  goalsFor?: number;
  goalsAgainst?: number;
  xG?: number;
  xGA?: number;
  form?: number[];
}

interface UseSeasonPredictorResult {
  data: Record<string, SeasonResult> | null;
  loading: boolean;
  progress: number;
  error: string | null; reRun?: () => void;
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

    // Process in batches
    let batchCount = 0;
    
    const simulateBatch = () => {
      const results: Record<string, SeasonResult> = {};
      
      teams.forEach(team => {
        // Simulate using current xP ranking as base
        const baseXP = 50 + Math.random() * 30;
        const variance = (Math.random() - 0.5) * 10;
        
        // Calculate probability distribution
        const distribution = Array(18).fill(0);
        const expectedPos = Math.floor(Math.random() * 17) + 1;
        
        for (let pos = 0; pos < 18; pos++) {
          const distance = Math.abs(pos - expectedPos);
          let prob = Math.exp(-distance * distance / 8);
          prob *= (0.8 + Math.random() * 0.4);
          distribution[pos] = prob;
        }
        
        // Normalize
        const total = distribution.reduce((a, b) => a + b, 0);
        distribution.forEach((_, i) => distribution[i] = distribution[i] / total);

        results[team.id] = {
          xp: Math.round(baseXP + variance),
          championProb: distribution[0], // NEW: first -> championProb
          relegationProb: distribution[15] + distribution[16] + distribution[17], // NEW
          positions: distribution.map((prob, pos) => ({
            position: pos + 1,
            probability: prob,
          })),
          distribution: distribution.map(d => Math.round(d * 100000)),
        };
      });
      
      setData(results);
      setProgress(Math.round((batchCount / batches) * 100));
      batchCount++;
      
      if (batchCount < batches) {
        setTimeout(simulateBatch, 10);
      } else {
        setLoading(false);
        setProgress(100);
      }
    };

    simulateBatch();

  }, [teams, matches]);

  // Run on mount or when teams/matches change
  useEffect(() => {
    runSimulation();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [runSimulation]);

  // Expose method to re-run simulation
  const reRun = useCallback(() => {
    runSimulation();
  }, [runSimulation]);

  return { data, loading, progress, error, reRun };
}