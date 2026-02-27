import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

interface WeightData {
  date: string;
  value: number;
}

interface Props {
  data: WeightData[];
}

export function WeightChart({ data }: Props) {
  const theme = useTheme();
  if (data.length === 0) {
    return (
      <View style={styles.container}>
        <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
          体重推移
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          データなし
        </Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  return (
    <View style={styles.container}>
      <Text variant="titleSmall" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
        体重推移
      </Text>
      <View style={styles.chart}>
        {data.map((d, i) => {
          const heightPct = ((d.value - minVal) / range) * 80 + 10;
          return (
            <View key={d.date} style={styles.pointGroup}>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 9 }}>
                {d.value}
              </Text>
              <View style={styles.dotContainer}>
                <View
                  style={[
                    styles.dot,
                    { bottom: `${heightPct}%` as any, backgroundColor: '#45B7D1' },
                  ]}
                />
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontSize: 9 }}>
                {d.date.slice(5)}
              </Text>
            </View>
          );
        })}
      </View>
      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'right' }}>
        最新: {values[values.length - 1]} kg
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  chart: { flexDirection: 'row', height: 120, alignItems: 'flex-end', gap: 4 },
  pointGroup: { flex: 1, alignItems: 'center', gap: 4 },
  dotContainer: { flex: 1, width: '100%', position: 'relative' },
  dot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: 'center',
  },
});
