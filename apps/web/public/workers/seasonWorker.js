// public/workers/seasonWorker.js
// Web Worker for Monte-Carlo Season Simulation
// Runs in background without blocking UI

function poisson(lambda) {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function simulateMatch(home, away) {
  const lambdaHome = home.attack * away.defense * home.homeAdv;
  const lambdaAway = away.attack * home.defense;

  const goalsHome = poisson(lambdaHome);
  const goalsAway = poisson(lambdaAway);

  if (goalsHome > goalsAway) return { home: 3, away: 0 };
  if (goalsHome < goalsAway) return { home: 0, away: 3 };
  return { home: 1, away: 1 };
}

function simulateSeason(fixtures, teams) {
  const table = {};
  teams.forEach(t => { table[t.id] = { points: 0 }; });

  for (const match of fixtures) {
    const home = teams.find(t => t.id === match.homeId);
    const away = teams.find(t => t.id === match.awayId);
    if (!home || !away) continue;
    
    const r = simulateMatch(home, away);
    table[home.id].points += r.home;
    table[away.id].points += r.away;
  }

  return table;
}

self.onmessage = function(event) {
  const { fixtures, teams, iterations } = event.data;

  const results = {};
  teams.forEach(t => {
    results[t.id] = {
      xp: 0,
      first: 0,
      relegation: 0,
      top4: 0,
      top6: 0,
      distribution: new Array(teams.length).fill(0)
    };
  });

  for (let i = 0; i < iterations; i++) {
    const table = simulateSeason(fixtures, teams);
    const sorted = Object.entries(table).sort((a, b) => b[1].points - a[1].points);

    sorted.forEach(([teamId, data], index) => {
      const pos = index + 1;
      results[teamId].xp += data.points;
      results[teamId].distribution[pos - 1]++;

      if (pos === 1) results[teamId].first++;
      if (pos <= 4) results[teamId].top4++;
      if (pos <= 6) results[teamId].top6++;
      if (pos >= teams.length - 2) results[teamId].relegation++;
    });
  }

  self.postMessage({ results, iterations });
};
