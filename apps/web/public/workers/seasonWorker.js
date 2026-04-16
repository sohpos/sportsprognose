// public/workers/seasonWorker.js
// Optimized Web Worker for Monte-Carlo Season Simulation
// EPIC 3 - Tasks 3.1, 3.2, 3.3

// Deterministic seed option
let SEED = null;
function setSeed(seed) {
  SEED = seed;
}

// Fast random with optional seed
function fastRandom() {
  if (SEED) {
    SEED = (SEED * 1103515245 + 12345) & 0x7fffffff;
    return SEED / 0x7fffffff;
  }
  return Math.random();
}

// Optimized Poisson using inverse transform
function poisson(lambda) {
  let L = Math.exp(-lambda);
  let k = 0;
  let p = fastRandom();
  let prod = p;
  while (prod > L) {
    k++;
    p = fastRandom();
    prod *= p;
  }
  return k;
}

// Single match simulation
function simulateMatch(homeXg, awayXg, homeAdv = 0.05) {
  const lambdaHome = Math.max(0, Math.min(homeXg * (2 - awayXg / 100) * (1 + homeAdv), 5);
  const lambdaAway = Math.max(0, Math.min(awayXg * (2 - homeXg / 100), 5));

  const goalsHome = poisson(lambdaHome);
  const goalsAway = poisson(lambdaAway);

  if (goalsHome > goalsAway) return { home: 3, away: 0 };
  if (goalsHome < goalsAway) return { home: 0, away: 3 };
  return { home: 1, away: 1 };
}

// Pre-compute transition matrix for position probabilities (Task 3.3)
function buildTransitionMatrix(teams) {
  const n = teams.length;
  const matrix = new Float64Array(n * n);
  
  teams.forEach((team, i) => {
    const avgXg = team.xG || 50;
    const strength = avgXg / 100;
    
    // Default: strong teams stay top, weak go down
    for (let j = 0; j < n; j++) {
      const dist = Math.abs(i - j);
      const prob = Math.exp(-dist * dist / (2 * 0.3 * 0.3));
      matrix[i * n + j] = prob;
    }
  });
  
  // Normalize rows
  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += matrix[i * n + j];
    }
    for (let j = 0; j < n; j++) {
      matrix[i * n + j] /= sum;
    }
  }
  
  return matrix;
}

// Main simulation using TypedArrays (Task 3.2)
function simulateSeason(fixtures, teams, iterations) {
  const n = teams.length;
  
  // Use TypedArrays for memory efficiency
  const totalPoints = new Float64Array(n);
  const positionCounts = new Uint32Array(n * n); // [team][position]
  
  for (let iter = 0; iter < iterations; iter++) {
    const table = new Map();
    teams.forEach((t, i) => {
      table.set(t.id, { pts: 0, gd: 0, index: i });
    });

    // Simulate all fixtures
    for (const fixture of fixtures) {
      const home = teams.find(t => t.id === fixture.homeId);
      const away = teams.find(t => t.id === fixture.awayId);
      if (!home || !away) continue;
      
      const result = simulateMatch(home.xG || 50, away.xG || 50, home.homeAdv || 0.05);
      
      const homeRec = table.get(home.id);
      const awayRec = table.get(away.id);
      
      homeRec.pts += result.home;
      awayRec.pts += result.away;
    }

    // Sort by points, then goal difference
    const sorted = Array.from(table.values())
      .sort((a, b) => b.pts - a.pts || b.gd - a.gd);

    // Count positions
    sorted.forEach((team, pos) => {
      totalPoints[team.index] += team.pts;
      positionCounts[team.index * n + pos]++;
    });
  }

  // Calculate averages
  const results = {};
  teams.forEach((t, i) => {
    const positions = [];
    for (let pos = 0; pos < n; pos++) {
      const count = positionCounts[i * n + pos];
      if (count > 0) {
        positions.push({ position: pos + 1, probability: count / iterations });
      }
    }
    
    results[t.id] = {
      avgPoints: totalPoints[i] / iterations,
      positions,
      championProb: positionCounts[i * n] / iterations,
      relegationProb: positionCounts[i * n + (n - 1)] / iterations,
    };
  });

  return results;
}

// Handle messages from main thread
self.onmessage = function(event) {
  const { fixtures, teams, iterations = 100000, seed } = event.data;

  if (seed !== undefined) {
    setSeed(seed);
  }

  console.log(`[Worker] Running ${iterations.toLocaleString()} simulations...`);
  const startTime = performance.now();

  // Pre-compute transition matrix
  const transitionMatrix = buildTransitionMatrix(teams);

  // Run simulations
  const results = simulateSeason(fixtures, teams, iterations);

  const elapsed = performance.now() - startTime;
  console.log(`[Worker] Done in ${elapsed.toFixed(0)}ms`);

  self.postMessage({ results, elapsed, transitionMatrix: Array.from(transitionMatrix) });
};

// Ready signal
self.postMessage({ ready: true });