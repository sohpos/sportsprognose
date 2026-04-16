import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import matchesRouter from './routes/matches';
import predictionsRouter from './routes/predictions';
import formRouter from './routes/form';
import valueHistoryRouter from './routes/team/valueHistory';
import apiRouter from './routes/api';
import seasonPredictorRouter from './routes/season/predictor';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/matches', matchesRouter);
app.use('/api/predictions', predictionsRouter);
app.use('/api/form', formRouter);
app.use('/api/team', valueHistoryRouter);
app.use('/api', apiRouter);
app.use('/api/season', seasonPredictorRouter);
app.use('/api/leagues', (_req, res) => {
  res.redirect('/api/matches/leagues');
});

app.listen(PORT, () => {
  console.log(`🚀 SportsPrognose Backend running on http://localhost:${PORT}`);
  console.log(`📊 API: http://localhost:${PORT}/api/matches`);
  console.log(`📈 Predictions: http://localhost:${PORT}/api/predictions/<matchId>`);
  console.log(`📋 Form: http://localhost:${PORT}/api/form/<teamId>`);
  console.log(`🛰️ Data source: ${process.env.FOOTBALL_API_KEY ? 'football-data.org (live)' : 'mock fallback'}`);
});

export default app;

// Health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get("/api/accuracy", (_req, res) => {
  res.json({
    week: new Date().toISOString().split("T")[0],
    predictions: 4,
    hits: 2,
    accuracy: 0.5,
    scoreAccuracy: 0.25,
    weekly: []
  });
});
