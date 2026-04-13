import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator,
  StyleSheet, Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { fetchMatches, fetchPrediction, fetchAccuracyStats } from '../lib/api';
import { Match, PredictionResult } from '@sportsprognose/core';

const COLORS = {
  bg: '#0a0e1a',
  card: '#151e35',
  green: '#00e676',
  blue: '#2979ff',
  text: '#e2e8f0',
  muted: '#64748b',
  border: 'rgba(255,255,255,0.06)',
};

export default function Dashboard() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<string, PredictionResult>>({});
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      fetchMatches().then(d => setMatches(d.matches?.slice(0, 4) || [])),
      fetchAccuracyStats().then(d => setStats(d.stats || [])),
    ]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    matches.forEach(m => {
      fetchPrediction(m.id)
        .then(d => d.prediction && setPredictions(p => ({ ...p, [m.id]: d.prediction })))
        .catch(() => {});
    });
  }, [matches]);

  const avgAccuracy = stats.length
    ? Math.round(stats.reduce((s, w) => s + w.outcomeAccuracy, 0) / stats.length)
    : null;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={styles.container}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>⚽ SportsPrognose</Text>
          <Text style={styles.heroSub}>KI-Fußballprognosen · Poisson-Modell</Text>
        </View>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatBox value="4" label="Ligen" />
          <StatBox value={avgAccuracy ? `${avgAccuracy}%` : '—'} label="Ø Genauigkeit" color={COLORS.green} />
          <StatBox value={String(matches.length)} label="Spiele heute" />
        </View>

        {/* Matches */}
        <Text style={styles.sectionTitle}>Nächste Spiele</Text>
        {loading ? (
          <ActivityIndicator color={COLORS.green} style={{ marginTop: 20 }} />
        ) : matches.length === 0 ? (
          <View style={styles.card}>
            <Text style={styles.muted}>Backend nicht erreichbar (Port 3001)</Text>
          </View>
        ) : (
          matches.map(match => (
            <Pressable
              key={match.id}
              style={styles.card}
              onPress={() => router.push(`/match/${match.id}` as any)}
            >
              <Text style={styles.leagueName}>{match.leagueName}</Text>
              <View style={styles.teamsRow}>
                <Text style={[styles.teamName, { flex: 1 }]}>{match.homeTeam.shortName}</Text>
                {predictions[match.id] ? (
                  <View style={styles.scoreBox}>
                    <Text style={styles.scoreText}>
                      {predictions[match.id].mostLikelyScore.home}:{predictions[match.id].mostLikelyScore.away}
                    </Text>
                    <Text style={{ color: COLORS.green, fontSize: 10 }}>
                      {predictions[match.id].confidence}%
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.muted}>vs</Text>
                )}
                <Text style={[styles.teamName, { flex: 1, textAlign: 'right' }]}>{match.awayTeam.shortName}</Text>
              </View>
              {predictions[match.id] && (
                <ProbBar
                  h={predictions[match.id].homeWinProbability}
                  d={predictions[match.id].drawProbability}
                  a={predictions[match.id].awayWinProbability}
                />
              )}
            </Pressable>
          ))
        )}

        <Text style={styles.disclaimer}>
          ⚠️ Statistische Prognosen, kein Wettaufruf. Erwartete Genauigkeit: 55–65%.
        </Text>
      </View>
    </ScrollView>
  );
}

function StatBox({ value, label, color }: { value: string; label: string; color?: string }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#151e35', borderRadius: 10, padding: 12, margin: 4, alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: color || '#e2e8f0' }}>{value}</Text>
      <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>{label}</Text>
    </View>
  );
}

function ProbBar({ h, d, a }: { h: number; d: number; a: number }) {
  const hp = Math.round(h * 100);
  const dp = Math.round(d * 100);
  const ap = Math.round(a * 100);
  return (
    <View style={{ marginTop: 8 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
        <Text style={{ color: '#00e676', fontSize: 10 }}>{hp}%</Text>
        <Text style={{ color: '#94a3b8', fontSize: 10 }}>{dp}%</Text>
        <Text style={{ color: '#2979ff', fontSize: 10 }}>{ap}%</Text>
      </View>
      <View style={{ flexDirection: 'row', height: 4, borderRadius: 2, overflow: 'hidden', backgroundColor: '#1c2845' }}>
        <View style={{ width: `${hp}%`, backgroundColor: '#00e676' }} />
        <View style={{ width: `${dp}%`, backgroundColor: '#94a3b8' }} />
        <View style={{ width: `${ap}%`, backgroundColor: '#2979ff' }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  hero: { alignItems: 'center', paddingVertical: 24 },
  heroTitle: { fontSize: 28, fontWeight: 'bold', color: '#00e676' },
  heroSub: { fontSize: 14, color: '#64748b', marginTop: 4 },
  statsRow: { flexDirection: 'row', marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#e2e8f0', marginBottom: 12 },
  card: {
    backgroundColor: '#151e35',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  leagueName: { fontSize: 10, color: '#00e676', marginBottom: 8, fontWeight: '600' },
  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  teamName: { fontSize: 15, fontWeight: '600', color: '#e2e8f0' },
  scoreBox: { alignItems: 'center' },
  scoreText: { fontSize: 20, fontWeight: 'bold', color: '#e2e8f0' },
  muted: { color: '#64748b', fontSize: 12 },
  disclaimer: { fontSize: 10, color: '#475569', textAlign: 'center', marginTop: 20, paddingBottom: 20 },
});
