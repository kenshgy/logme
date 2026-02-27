import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Appbar, FAB, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateHeader } from '../../src/components/common/DateHeader';
import { EmptyTimeline } from '../../src/components/timeline/EmptyTimeline';
import { TimelineEntry } from '../../src/components/timeline/TimelineEntry';
import { useEntriesByDate } from '../../src/hooks/useEntriesByDate';
import { useUIStore } from '../../src/stores/uiStore';

export default function TodayScreen() {
  const theme = useTheme();
  const { selectedDate } = useUIStore();
  const { entries } = useEntriesByDate(selectedDate);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Content title="logme" titleStyle={{ fontWeight: '700' }} />
        <Appbar.Action
          icon="cog"
          onPress={() => router.push('/(modals)/settings/index')}
        />
      </Appbar.Header>
      <DateHeader />
      <FlatList
        data={entries}
        keyExtractor={(item) => String(item.log_entries.id)}
        renderItem={({ item }) => (
          <TimelineEntry
            entry={item.log_entries}
            category={item.categories}
            onPress={() =>
              router.push(`/(modals)/entry/${item.log_entries.id}`)
            }
          />
        )}
        ListEmptyComponent={<EmptyTimeline />}
        contentContainerStyle={entries.length === 0 ? styles.emptyList : styles.list}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => router.push('/(modals)/entry/new')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
    paddingBottom: 80,
  },
  emptyList: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
});
