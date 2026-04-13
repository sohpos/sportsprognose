import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { fetchAccuracyStats } from '../lib/api';

export default function AccuracyScreen() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAccuracyStats()
      .then(d => setStats(d.stats || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avgAccuracy = stats.length
    ? Math.round(stats.reduce((s, w) => s + w.outcomeAccuracy, 0) / stats.length)
    : 0;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0a0e1a' }} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.bigStatCard}>
        <Text style={styles.bigStat}>{avgAccuracy}%</Text>
        <Text style={styles.bigStatLabel}>Ø Ergebnis-Genauigkeit (8 Wochen)</Text>
        <Text style={{ color: '#64748b', fontSize: 11, marginTop: 8, textAlign: 'center' }}>
          Realistisch: 55–65% · "80%" ist Marketing
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#00e676" style={{ marginTop: 40 }} />
      ) : (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Wöchentliche Übersicht</Text>
          {stats.map((week, i) => (
            <View key={i} style={styles.weekRow}>
              <Text style={styles.weekLabel}>{week.week}</Text>
              <Text style={styles.weekCount}>{week.totalPredictions}x</Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width: `${week.outcomeAccuracy}%`,
                      backgroundColor: week.outcomeAccuracy >= 65 ? '#00e676' : week.outcomeAccuracy >= 55 ? '#2979ff' : '#f87171',
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.weekAccuracy,
                  { color: week.outcomeAccuracy >= 65 ? '#00e676' : week.outcomeAccuracy >= 55 ? '#2979ff' : '#f87171' },
                ]}
              >
                {week.outcomeAccuracy}%
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={styles.warningCard}>
        <Text style={{ color: '#fbbf24', fontSize: 13, fontWeight: '600', marginBottom: 6 }}>
          ⚠️ Wichtiger Hinweis
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 12, lineHeight: 18 }}>
          Statistik ≠ Garantie. Diese App ist ein Analyse-Tool, kein Wett-Tool.
          Fußball ist chaotisch — das ist der ganze Spaß daran.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  bigStatCard: {
    backgroundColor: '#151e35',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,230,118,0.2)',
  },
  bigStat: { fontSize: 56, fontWeight: 'bold', color: '#00e676' },
  bigStatLabel: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  card: {
    backgroundColor: '#151e35',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  weekRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  weekLabel: { width: 70, fontSize: 10, color: '#64748b' },
  weekCount: { width: 30, fontSize: 10, color: '#94a3b8' },
  barContainer: { flex: 1, height: 6, backgroundColor: '#1c2845', borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  weekAccuracy: { width: 40, textAlign: 'right', fontSize: 12, fontWeight: '700' },
  warningCard: {
    backgroundColor: 'rgba(234,179,8,0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(234,179,8,0.2)',
    marginBottom: 20,
  },
});
