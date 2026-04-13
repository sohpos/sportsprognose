// Update this URL for your local network IP or deployed backend
const API_URL = 'http://localhost:3002';

export async function fetchMatches(league?: string) {
  const url = league
    ? `${API_URL}/api/matches?league=${league}`
    : `${API_URL}/api/matches`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch matches');
  return res.json();
}

export async function fetchPrediction(matchId: string) {
  const res = await fetch(`${API_URL}/api/predictions/${matchId}`);
  if (!res.ok) throw new Error('Failed to fetch prediction');
  return res.json();
}

export async function fetchAccuracyStats() {
  const res = await fetch(`${API_URL}/api/predictions/stats/accuracy`);
  if (!res.ok) throw new Error('Failed to fetch accuracy');
  return res.json();
}
