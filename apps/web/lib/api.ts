const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function fetchMatches(league?: string) {
  const url = league
    ? `${API_URL}/api/matches?league=${league}`
    : `${API_URL}/api/matches`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Failed to fetch matches');
  return res.json();
}

export async function fetchPrediction(matchId: string) {
  const res = await fetch(`${API_URL}/api/predictions/${matchId}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to fetch prediction');
  return res.json();
}

export async function fetchLeagues() {
  const res = await fetch(`${API_URL}/api/matches/leagues`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Failed to fetch leagues');
  return res.json();
}

export async function fetchAccuracyStats() {
  const res = await fetch(`${API_URL}/api/predictions/stats/accuracy`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error('Failed to fetch accuracy stats');
  return res.json();
}
