import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchMatches, fetchPrediction } from '../lib/api';
import { Match, PredictionResult } from '@sportsprognose/core';

const LEAGUES = [
  { id: '', label: 'Alle' },
  { id: 'BL1', label: 'Bundesliga' },
  { id: 'PL', label: 'Premier League' },
  { id: 'PD', label: 'La Liga' },
  { id: 'CL', label: 'Champions League' },
];

export default function MatchesScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<string, PredictionResult>>({});
  const [selectedLeague, setSelectedLeague] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchMatches(selectedLeague || undefined)
      .then(d => {
        setMatches(d.matches || []);
        setLoading(false);
        d.matches?.forEach((m: Match) => {
          fetchPrediction(m.id)
            .then((d: any) => d.prediction && setPredictions(p => ({ ...p, [m.id]: d.prediction })))
            .catch(() => {});
        });
      })
      .catch(() => setLoading(false));
  }, [selectedLeague]);

  return (
    <View style={{ flex: 1, backgroundColor: '#0a0e1a' }}>
      {/* League filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {LEAGUES.map(l => (
          <Pressable
            key={l.id}
            style={[styles.filterChip, selectedLeague === l.id && styles.filterChipActive]}
            onPress={() => setSelectedLeague(l.id)}
          >
            <Text style={[styles.filterText, selectedLeague === l.id && styles.filterTextActive]}>
              {l.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.count}>{matches.length} Spiele</Text>

        {loading ? (
          <ActivityIndicator color="#00e676" style={{ marginTop: 40 }} />
        ) : (
          matches.map(match => {
            const pred = predictions[match.id];
            const date = new Date(match.utcDate);
            return (
              <Pressable key={match.id} style={styles.card} onPress={() => router.push(`/match/${match.id}` as any)}>
                <View style={styles.cardHeader}>
                  <Text style={styles.league}>{match.leagueName}</Text>
                  <Text style={styles.date}>
                    {date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })} · {date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                <View style={styles.teamsRow}>
                  <Text style={[styles.team, { flex: 1 }]}>{match.homeTeam.name}</Text>
                  {pred ? (
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.score}>{pred.mostLikelyScore.home}:{pred.mostLikelyScore.away}</Text>
                      <Text style={{ color: '#00e676', fontSize: 10 }}>{pred.confidence}%</Text>
                    </View>
                  ) : (
                    <Text style={{ color: '#475569' }}>–</Text>
                  )}
                  <Text style={[styles.team, { flex: 1, textAlign: 'right' }]}>{match.awayTeam.name}</Text>
                </View>
                {pred && (
                  <View style={{ flexDirection: 'row', height: 3, borderRadius: 2, overflow: 'hidden', marginTop: 8, backgroundColor: '#1c2845' }}>
                    <View style={{ width: `${Math.round(pred.homeWinProbability * 100)}%`, backgroundColor: '#00e676' }} />
                    <View style={{ width: `${Math.round(pred.drawProbability * 100)}%`, backgroundColor: '#94a3b8' }} />
                    <View style={{ width: `${Math.round(pred.awayWinProbability * 100)}%`, backgroundColor: '#2979ff' }} />
                  </View>
                )}
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: { backgroundColor: '#0f1629', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', marginRight: 8 },
  filterChipActive: { backgroundColor: '#00e676' },
  filterText: { color: '#94a3b8', fontSize: 13 },
  filterTextActive: { color: '#0a0e1a', fontWeight: '700' },
  count: { color: '#475569', fontSize: 12, marginBottom: 12 },
  card: { backgroundColor: '#151e35', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  league: { fontSize: 10, fontWeight: '600', color: '#00e676' },
  date: { fontSize: 10, color: '#475569' },
  teamsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  team: { fontSize: 14, fontWeight: '600', color: '#e2e8f0' },
  score: { fontSize: 18, fontWeight: 'bold', color: '#e2e8f0' },
});
