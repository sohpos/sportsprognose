# Season Predictor Dashboard

A production-ready, modular analytics dashboard for football season predictions with Monte Carlo simulations, featuring 10 React components, comprehensive test coverage, and cross-browser visual regression testing.

## 🚀 Features

### Core Components

| Component | Description |
|-----------|-------------|
| `SeasonPredictorPage` | Main dashboard with loading state and data orchestration |
| `SeasonXPTable` | Expected Points (xP) ranking table |
| `SeasonChances` | Championship and relegation probabilities |
| `PositionDistributionChart` | Heatmap-style position distribution (18 positions) |
| `TeamSummaryGrid` | Compact team overview grid |
| `SurpriseIndex` | Luck factor, consistency, xG delta, momentum metrics |
| `TeamInsightCard` | Premium team card (full/compact modes) |
| `LeagueInsightsPanel` | Auto-generated league storylines (12 sections) |
| `ScatterPlotXPvsActual` | xP vs Actual scatter plot with 4-quadrant highlighting |
| `TeamDetailPage` | Individual team detail view with form curve, xG breakdown |

### Advanced Features

- **Surprise Index**: Luck Factor, Consistency Score, xG Delta, Momentum Trend
- **League Insights**: Auto-generated storylines (overperformers, underperformers, etc.)
- **Scatter Plot**: 4-Quadrant analysis (Good & Efficient, Lucky, Unlucky, Bad)
- **What-If Engine**: Simulation for hypothetical match outcomes (tests included)
- **Visual Regression**: Pixel-accurate screenshots for UI stability

## 📦 Installation

```bash
npm install
```

## 🧪 Testing

```bash
# Run all unit tests
npm run test:run

# Run unit tests with coverage
npm run test:coverage

# Run E2E tests (requires dev server)
npm run test:e2e

# Run all tests
npm run test:all
```

### Test Coverage

- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright (Chrome, Firefox, WebKit)
- **Visual Regression**: Playwright screenshot comparison
- **What-If Tests**: Simulation logic and UI integration
- **Coverage Threshold**: 80% lines, 80% functions, 75% branches, 80% statements

## 🔧 Architecture

```
components/season-predictor/
├── types.ts           # Shared TypeScript interfaces
├── utils.ts           # Utility functions (calculation, formatting)
├── index.ts           # Barrel exports
├── SeasonPredictorPage.tsx
├── SeasonXPTable.tsx
├── SeasonChances.tsx
├── PositionDistributionChart.tsx
├── TeamSummaryGrid.tsx
├── SurpriseIndex.tsx
├── TeamInsightCard.tsx
├── LeagueInsightsPanel.tsx
├── ScatterPlotXPvsActual.tsx
└── TeamDetailPage.tsx
```

## 🧩 Data Structure

```typescript
interface TeamData {
  xp: number                    // Expected Points
  first: number                // Champion probability (out of 100k)
  relegation: number           // Relegation probability (out of 100k)
  distribution: number[]       // Position distribution (18 elements)
  actualPoints?: number        // Actual league points
  goalsFor?: number            // Goals scored
  goalsAgainst?: number        // Goals conceded
  xG?: number                  // Expected Goals
  xGA?: number                 // Expected Goals Against
  form?: number[]              // Last 5 match results (0, 1, or 3 points)
  homePoints?: number          // Home record
  awayPoints?: number          // Away record
}
```

## 📊 CI Pipeline

GitHub Actions workflow (`.github/workflows/test.yml`) includes:

1. **Unit Tests** → Vitest with coverage → Codecov
2. **E2E Tests** → Playwright (Chrome, Firefox, WebKit)
3. **Lint** → TypeScript type checking
4. **Build** → Full project build

## 🎨 Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Testing**: Vitest, React Testing Library, Playwright
- **Charts**: Pure SVG (no external libraries)
- **TypeScript**: Full type safety

## 📝 License

MIT