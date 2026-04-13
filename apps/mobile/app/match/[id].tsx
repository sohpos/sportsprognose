import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchMatches, fetchPrediction } from '../../lib/api';
import { Match, PredictionResult } from '@sportsprognose/core';

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [match, setMatch] = useState<Match | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchMatches()
      .then(d => {
        const m = d.matches?.find((m: Match) => m.id === id);
        if (m) {
          setMatch(m);
          return fetchPrediction(id);
        }
      })
      .then(d => d?.prediction && setPrediction(d.prediction))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0e1a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color="#00e676" size="large" />
      </View>
    );
  }

  if (!match) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0a0e1a', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#e2e8f0' }}>Spiel nicht gefunden</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: '#00e676' }}>← Zurück</Text>
        </Pressable>
      </View>
    );
  }

  const date = new Date(match.utcDate);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0a0e1a' }} contentContainerStyle={{ padding: 16 }}>
      <Pressable onPress={() => router.back()} style={{ marginBottom: 16 }}>
        <Text style={{ color: '#64748b', fontSize: 14 }}>← Alle Spiele</Text>
      </Pressable>

      {/* Match header */}
      <View style={styles.matchCard}>
        <Text style={styles.leagueName}>{match.leagueName}</Text>
        <Text style={styles.matchDate}>
          {date.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' })} · {date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
        </Text>

        <View style={styles.teamsRow}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.teamName}>{match.homeTeam.name}</Text>
            <Text style={styles.teamStat}>⌀ {match.homeTeam.avgGoalsScored.toFixed(1)} Tore</Text>
            <Text style={styles.form}>{match.homeTeam.form}</Text>
          </View>

          <View style={{ alignItems: 'center', paddingHorizontal: 12 }}>
            {prediction ? (
              <>
                <Text style={styles.bigScore}>
                  {prediction.mostLikelyScore.home}–{prediction.mostLikelyScore.away}
                </Text>
                <Text style={{ color: '#00e676', fontSize: 12 }}>{prediction.confidence}% sicher</Text>
              </>
            ) : (
              <Text style={{ color: '#475569', fontSize: 20 }}>VS</Text>
            )}
          </View>

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.teamName}>{match.awayTeam.name}</Text>
            <Text style={styles.teamStat}>⌀ {match.awayTeam.avgGoalsScored.toFixed(1)} Tore</Text>
            <Text style={styles.form}>{match.awayTeam.form}</Text>
          </View>
        </View>
      </View>

      {prediction && (
        <>
          {/* Outcomes */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Ausgangs-Wahrscheinlichkeiten</Text>
            <View style={styles.outcomeRow}>
              {[
                { label: 'Heimsieg', prob: prediction.homeWinProbability, color: '#00e676', outcome: 'HOME' },
                { label: 'Unentsch.', prob: prediction.drawProbability, color: '#94a3b8', outcome: 'DRAW' },
                { label: 'Auswärts', prob: prediction.awayWinProbability, color: '#2979ff', outcome: 'AWAY' },
              ].map(item => (
                <View
                  key={item.label}
                  style={[
                    styles.outcomeBox,
                    prediction.predictedOutcome === item.outcome && { borderColor: item.color, backgroundColor: `${item.color}15` },
                  ]}
                >
                  <Text style={{ fontSize: 22, fontWeight: 'bold', color: item.color }}>
                    {(item.prob * 100).toFixed(0)}%
                  </Text>
                  <Text style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{item.label}</Text>
                  {prediction.predictedOutcome === item.outcome && (
                    <Text style={{ fontSize: 9, color: item.color, marginTop: 2 }}>✓ Prognose</Text>
                  )}
                </View>
              ))}
            </View>

            <View style={styles.overUnderRow}>
              <View style={styles.overUnderBox}>
                <Text style={{ color: '#f97316', fontSize: 18, fontWeight: 'bold' }}>
                  {(prediction.over25Probability * 100).toFixed(0)}%
                </Text>
                <Text style={{ color: '#64748b', fontSize: 11 }}>Over 2.5</Text>
              </View>
              <View style={styles.overUnderBox}>
                <Text style={{ color: '#22d3ee', fontSize: 18, fontWeight: 'bold' }}>
                  {(prediction.under25Probability * 100).toFixed(0)}%
                </Text>
                <Text style={{ color: '#64748b', fontSize: 11 }}>Under 2.5</Text>
              </View>
            </View>
          </View>

          {/* Top scores */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Wahrscheinlichste Ergebnisse</Text>
            {prediction.scoreMatrix
              .sort((a, b) => b.probability - a.probability)
              .slice(0, 5)
              .map((s, i) => {
                const maxProb = prediction.scoreMatrix[0]?.probability || 1;
                return (
                  <View key={i} style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>{s.homeGoals}:{s.awayGoals}</Text>
                    <View style={styles.scoreBarContainer}>
                      <View
                        style={[
                          styles.scoreBarFill,
                          {
                            width: `${(s.probability / prediction.scoreMatrix.sort((a, b) => b.probability - a.probability)[0].probability) * 100}%`,
                            backgroundColor: i === 0 ? '#00e676' : '#2979ff',
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.scoreProb}>{(s.probability * 100).toFixed(1)}%</Text>
                  </View>
                );
              })}
          </View>

          <Text style={{ color: '#475569', fontSize: 10, textAlign: 'center', marginBottom: 20 }}>
            ⚠️ Statistik ≠ Garantie · 55–65% ist realistische Genauigkeit
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  matchCard: { backgroundColor: '#151e35', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)', alignItems: 'center' },
  leagueName: { fontSize: 11, fontWeight: '600', color: '#00e676', marginBottom: 4 },
  matchDate: { fontSize: 11, color: '#64748b', marginBottom: 16 },
  teamsRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  teamName: { fontSize: 15, fontWeight: '700', color: '#e2e8f0', textAlign: 'center' },
  teamStat: { fontSize: 11, color: '#64748b', marginTop: 3 },
  form: { fontSize: 12, color: '#94a3b8', marginTop: 2, fontFamily: 'monospace' },
  bigScore: { fontSize: 36, fontWeight: 'black', color: '#e2e8f0' },
  card: { backgroundColor: '#151e35', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  cardTitle: { fontSize: 11, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 },
  outcomeRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  outcomeBox: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  overUnderRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', paddingTop: 12 },
  overUnderBox: { flex: 1, alignItems: 'center' },
  scoreRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  scoreLabel: { width: 36, fontSize: 14, fontWeight: '700', color: '#e2e8f0', fontFamily: 'monospace' },
  scoreBarContainer: { flex: 1, height: 6, backgroundColor: '#1c2845', borderRadius: 3, overflow: 'hidden', marginHorizontal: 8 },
  scoreBarFill: { height: '100%', borderRadius: 3 },
  scoreProb: { width: 42, textAlign: 'right', fontSize: 12, color: '#94a3b8' },
});
