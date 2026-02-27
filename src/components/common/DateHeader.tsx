import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { addDays, subDays } from 'date-fns';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { fromDateString, formatDisplayDate, toDateString } from '../../utils/dateUtils';
import { useUIStore } from '../../stores/uiStore';

export function DateHeader() {
  const theme = useTheme();
  const { selectedDate, setSelectedDate } = useUIStore();

  const handlePrev = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const prev = subDays(fromDateString(selectedDate), 1);
    setSelectedDate(toDateString(prev));
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const next = addDays(fromDateString(selectedDate), 1);
    setSelectedDate(toDateString(next));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <TouchableOpacity onPress={handlePrev} style={styles.arrow}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={28}
          color={theme.colors.onSurface}
        />
      </TouchableOpacity>
      <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
        {formatDisplayDate(selectedDate)}
      </Text>
      <TouchableOpacity onPress={handleNext} style={styles.arrow}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={28}
          color={theme.colors.onSurface}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  arrow: {
    padding: 8,
  },
});
