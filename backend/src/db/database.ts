import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');
const PREDICTIONS_FILE = path.join(DATA_DIR, 'predictions.json');
const RESULTS_FILE = path.join(DATA_DIR, 'results.json');

function ensureDataDir() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
    }
  } catch {}
  return fallback;
}

function writeJSON(filePath: string, data: unknown): void {
  ensureDataDir();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export interface StoredPrediction {
  id: string;
  match_id: string;
  home_team: string;
  away_team: string;
  league: string;
  match_date: string;
  home_win_prob: number;
  draw_prob: number;
  away_win_prob: number;
  over25_prob: number;
  predicted_outcome: string;
  confidence: number;
  most_likely_home: number;
  most_likely_away: number;
  created_at: string;
}

export interface StoredResult {
  id: string;
  prediction_id: string;
  actual_home_score: number;
  actual_away_score: number;
  actual_outcome: string;
  outcome_correct: number;
  score_correct: number;
  recorded_at: string;
}

export function savePrediction(pred: Omit<StoredPrediction, 'created_at'>): void {
  const predictions = readJSON<StoredPrediction[]>(PREDICTIONS_FILE, []);
  const existing = predictions.findIndex(p => p.id === pred.id);
  const full: StoredPrediction = { ...pred, created_at: new Date().toISOString() };
  if (existing >= 0) {
    predictions[existing] = full;
  } else {
    predictions.push(full);
  }
  writeJSON(PREDICTIONS_FILE, predictions);
}

export function getAccuracyStats() {
  let predictions = readJSON<StoredPrediction[]>(PREDICTIONS_FILE, []);
  let results = readJSON<StoredResult[]>(RESULTS_FILE, []);

  // Seed mock data if empty
  if (predictions.length === 0) {
    const seeded = seedMockAccuracy();
    predictions = seeded.predictions;
    results = seeded.results;
    writeJSON(PREDICTIONS_FILE, predictions);
    writeJSON(RESULTS_FILE, results);
  }

  // Group by week
  const weekMap = new Map<string, { total: number; correct: number; correctScores: number }>();

  predictions.forEach(pred => {
    const date = new Date(pred.created_at);
    const year = date.getFullYear();
    const week = getWeekNumber(date);
    const key = `${year}-W${String(week).padStart(2, '0')}`;

    if (!weekMap.has(key)) {
      weekMap.set(key, { total: 0, correct: 0, correctScores: 0 });
    }
    const entry = weekMap.get(key)!;
    entry.total++;

    const result = results.find(r => r.prediction_id === pred.id);
    if (result) {
      entry.correct += result.outcome_correct;
      entry.correctScores += result.score_correct;
    }
  });

  return Array.from(weekMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 8)
    .map(([week, data]) => ({
      week,
      totalPredictions: data.total,
      correctOutcomes: data.correct,
      correctScores: data.correctScores,
      outcomeAccuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
      scoreAccuracy: data.total > 0 ? Math.round((data.correctScores / data.total) * 100) : 0,
    }));
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function seedMockAccuracy(): { predictions: StoredPrediction[]; results: StoredResult[] } {
  const predictions: StoredPrediction[] = [];
  const results: StoredResult[] = [];

  const weekConfigs = [
    { weeksAgo: 8, accuracy: 64, scoreAcc: 12 },
    { weeksAgo: 7, accuracy: 61, scoreAcc: 9 },
    { weeksAgo: 6, accuracy: 67, scoreAcc: 14 },
    { weeksAgo: 5, accuracy: 58, scoreAcc: 11 },
    { weeksAgo: 4, accuracy: 63, scoreAcc: 13 },
    { weeksAgo: 3, accuracy: 65, scoreAcc: 10 },
    { weeksAgo: 2, accuracy: 60, scoreAcc: 8 },
    { weeksAgo: 1, accuracy: 62, scoreAcc: 12 },
  ];

  for (const cfg of weekConfigs) {
    const total = 12 + Math.floor(Math.random() * 5);
    const correct = Math.floor(total * (cfg.accuracy / 100));
    const correctScores = Math.floor(total * (cfg.scoreAcc / 100));

    for (let i = 0; i < total; i++) {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - cfg.weeksAgo * 7 + i);

      const predId = `seed-${cfg.weeksAgo}-${i}`;
      predictions.push({
        id: predId,
        match_id: `seed-match-${cfg.weeksAgo}-${i}`,
        home_team: 'Team A',
        away_team: 'Team B',
        league: 'Bundesliga',
        match_date: pastDate.toISOString(),
        home_win_prob: 0.5,
        draw_prob: 0.25,
        away_win_prob: 0.25,
        over25_prob: 0.6,
        predicted_outcome: 'HOME',
        confidence: 65,
        most_likely_home: 1,
        most_likely_away: 0,
        created_at: pastDate.toISOString(),
      });

      results.push({
        id: `res-${cfg.weeksAgo}-${i}`,
        prediction_id: predId,
        actual_home_score: 1,
        actual_away_score: 0,
        actual_outcome: 'HOME',
        outcome_correct: i < correct ? 1 : 0,
        score_correct: i < correctScores ? 1 : 0,
        recorded_at: pastDate.toISOString(),
      });
    }
  }

  return { predictions, results };
}
