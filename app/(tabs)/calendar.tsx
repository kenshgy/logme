import { router } from 'expo-router';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMonthActivity } from '../../src/hooks/useMonthActivity';
import { useUIStore } from '../../src/stores/uiStore';
import { useEntriesByDate } from '../../src/hooks/useEntriesByDate';
import { TimelineEntry } from '../../src/components/timeline/TimelineEntry';

export default function CalendarScreen() {
  const theme = useTheme();
  const { selectedDate, setSelectedDate } = useUIStore();
  const [currentMonth, setCurrentMonth] = useState(() =>
    format(new Date(), 'yyyy-MM')
  );
  const { activityMap } = useMonthActivity(currentMonth);
  const { entries } = useEntriesByDate(selectedDate);

  // Build marked dates for react-native-calendars
  const markedDates: Record<string, any> = {};
  for (const [date, activity] of Object.entries(activityMap)) {
    markedDates[date] = {
      dots: activity.dots,
      marked: true,
      selected: date === selectedDate,
      selectedColor: theme.colors.primary,
    };
  }
  if (!markedDates[selectedDate]) {
    markedDates[selectedDate] = {
      selected: true,
      selectedColor: theme.colors.primary,
    };
  } else {
    markedDates[selectedDate].selected = true;
    markedDates[selectedDate].selectedColor = theme.colors.primary;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <Calendar
        current={selectedDate}
        onDayPress={(day: any) => setSelectedDate(day.dateString)}
        onMonthChange={(month: any) => setCurrentMonth(month.dateString.substring(0, 7))}
        markedDates={markedDates}
        markingType="multi-dot"
        theme={{
          backgroundColor: theme.colors.surface,
          calendarBackground: theme.colors.surface,
          textSectionTitleColor: theme.colors.onSurfaceVariant,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.onSurface,
          textDisabledColor: theme.colors.outline,
          dotColor: theme.colors.primary,
          monthTextColor: theme.colors.onSurface,
          arrowColor: theme.colors.primary,
        }}
      />
      <View style={styles.summaryHeader}>
        <Text variant="titleSmall" style={{ color: theme.colors.onSurface }}>
          {selectedDate} の記録 ({entries.length}件)
        </Text>
      </View>
      <ScrollView style={styles.list} contentContainerStyle={{ paddingBottom: 24 }}>
        {entries.map((item) => (
          <TimelineEntry
            key={item.log_entries.id}
            entry={item.log_entries}
            category={item.categories}
            onPress={() => router.push(`/(modals)/entry/${item.log_entries.id}`)}
          />
        ))}
        {entries.length === 0 && (
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 24 }}
          >
            この日の記録はありません
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  summaryHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  list: { flex: 1 },
});
