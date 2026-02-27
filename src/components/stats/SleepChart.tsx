import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { minutesToDisplay } from '../../utils/durationUtils';

interface SleepData {
  date: string;
  durationMin: number;
  rating?: number | null;
}

interface Props {
  data: SleepData[];
}

export function SleepChart({ data }: Props) {
  const theme = useTheme();
  const maxMin = Math.max(...data.map((d) => d.durationMin), 480);

  return (
    <View style={styles.container}>
      <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
        睡眠時間
      </Text>
      {data.length === 0 ? (
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          データなし
        </Text>
      ) : (
        <View style={styles.bars}>
          {data.map((d) => (
            <View key={d.date} style={styles.barGroup}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 9 }}>
                {minutesToDisplay(d.durationMin)}
              </Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: Math.max(4, (d.durationMin / maxMin) * 100),
                      backgroundColor: '#6C63FF',
                    },
                  ]}
                />
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 9 }}>
                {d.date.slice(5)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 130 },
  barGroup: { flex: 1, alignItems: 'center', gap: 4 },
  barContainer: { flex: 1, justifyContent: 'flex-end', width: '100%' },
  bar: { width: '100%', borderRadius: 4, minHeight: 4 },
});
