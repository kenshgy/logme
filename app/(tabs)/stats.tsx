import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { and, eq, gte, lte } from 'drizzle-orm';
import { subDays, format } from 'date-fns';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, SegmentedButtons, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../../src/db/client';
import { categories, logEntries } from '../../src/db/schema';
import { SleepChart } from '../../src/components/stats/SleepChart';
import { WeightChart } from '../../src/components/stats/WeightChart';
import { useSleepStats } from '../../src/hooks/useSleepStats';
import { useWeightStats } from '../../src/hooks/useWeightStats';

type Period = '7' | '30' | '90';

function ActivityChart({ days }: { days: number }) {
  const theme = useTheme();
  const endDate = format(new Date(), 'yyyy-MM-dd');
  const startDate = format(subDays(new Date(), days - 1), 'yyyy-MM-dd');

  const { data } = useLiveQuery(
    db
      .select()
      .from(logEntries)
      .innerJoin(categories, eq(logEntries.categoryId, categories.id))
      .where(and(gte(logEntries.date, startDate), lte(logEntries.date, endDate)))
  );

  // Count entries per category
  const counts: Record<string, { name: string; color: string; count: number }> = {};
  for (const row of data ?? []) {
    const key = row.categories.name;
    if (!counts[key]) {
      counts[key] = { name: key, color: row.categories.color, count: 0 };
    }
    counts[key].count++;
  }

  const sorted = Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 8);
  const maxCount = Math.max(...sorted.map((c) => c.count), 1);

  return (
    <View>
      <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
        カテゴリ別記録数
      </Text>
      {sorted.length === 0 ? (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          データなし
        </Text>
      ) : (
        sorted.map((item) => (
          <View key={item.name} style={styles.activityRow}>
            <Text
              variant="bodySmall"
              style={[styles.activityLabel, { color: theme.colors.onSurface }]}
            >
              {item.name}
            </Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.activityBar,
                  {
                    width: `${(item.count / maxCount) * 100}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
            <Text
              variant="bodySmall"
              style={[styles.countLabel, { color: theme.colors.onSurfaceVariant }]}
            >
              {item.count}
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

export default function StatsScreen() {
  const theme = useTheme();
  const [period, setPeriod] = useState<Period>('7');
  const days = parseInt(period, 10);
  const { stats: sleepStats } = useSleepStats(days);
  const { stats: weightStats } = useWeightStats(days);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <SegmentedButtons
          value={period}
          onValueChange={(v) => setPeriod(v as Period)}
          buttons={[
            { value: '7', label: '7日' },
            { value: '30', label: '30日' },
            { value: '90', label: '90日' },
          ]}
          style={styles.segment}
        />

        <Card style={styles.card}>
          <Card.Content>
            <SleepChart data={sleepStats} />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <WeightChart data={weightStats} />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <ActivityChart days={days} />
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 16, paddingBottom: 32 },
  segment: { marginBottom: 4 },
  card: { borderRadius: 12 },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  activityLabel: { width: 80, fontSize: 12 },
  barTrack: { flex: 1, height: 16, backgroundColor: '#F1F3F4', borderRadius: 8, overflow: 'hidden' },
  activityBar: { height: '100%', borderRadius: 8, minWidth: 4 },
  countLabel: { width: 24, textAlign: 'right', fontSize: 12 },
});
