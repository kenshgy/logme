import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export function EmptyTimeline() {
  const theme = useTheme();
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons
        name="notebook-outline"
        size={64}
        color={theme.colors.onSurfaceVariant}
        style={styles.icon}
      />
      <Text variant="titleMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        記録がありません
      </Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}>
        右下の＋ボタンから記録を追加してください
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  icon: {
    marginBottom: 8,
    opacity: 0.5,
  },
});
