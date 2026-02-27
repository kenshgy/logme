import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { formatTimeFromDate } from '../../../utils/dateUtils';
import { minutesToDisplay } from '../../../utils/durationUtils';

interface Props {
  initialStart?: Date;
  initialEnd?: Date;
  initialRating?: number;
  initialNote?: string;
  onSubmit: (data: {
    startedAt: Date;
    endedAt: Date;
    durationMin: number;
    rating: number;
    note?: string;
  }) => void;
}

export function SleepForm({ initialStart, initialEnd, initialRating = 3, initialNote = '', onSubmit }: Props) {
  const theme = useTheme();
  const [startTime, setStartTime] = useState(() => {
    if (initialStart) return initialStart;
    const d = new Date();
    d.setHours(23, 0, 0, 0);
    return d;
  });
  const [endTime, setEndTime] = useState(() => {
    if (initialEnd) return initialEnd;
    const d = new Date();
    d.setHours(7, 0, 0, 0);
    return d;
  });
  const [rating, setRating] = useState(initialRating);
  const [note, setNote] = useState(initialNote);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  // Handle overnight sleep
  let endMs = endTime.getTime();
  let startMs = startTime.getTime();
  if (endMs <= startMs) {
    endMs += 24 * 60 * 60 * 1000;
  }
  const durationMin = Math.round((endMs - startMs) / 60000);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button
          mode="outlined"
          onPress={() => setShowStart(true)}
          icon="weather-night"
          style={styles.halfButton}
        >
          就寝: {formatTimeFromDate(startTime)}
        </Button>
        <Button
          mode="outlined"
          onPress={() => setShowEnd(true)}
          icon="weather-sunny"
          style={styles.halfButton}
        >
          起床: {formatTimeFromDate(endTime)}
        </Button>
      </View>
      <Text variant="bodyLarge" style={styles.duration}>
        睡眠時間: {minutesToDisplay(durationMin)}
      </Text>
      {showStart && (
        <DateTimePicker
          value={startTime}
          mode="time"
          is24Hour
          onChange={(_, date) => {
            setShowStart(Platform.OS === 'ios');
            if (date) setStartTime(date);
          }}
        />
      )}
      {showEnd && (
        <DateTimePicker
          value={endTime}
          mode="time"
          is24Hour
          onChange={(_, date) => {
            setShowEnd(Platform.OS === 'ios');
            if (date) setEndTime(date);
          }}
        />
      )}
      <View style={styles.ratingSection}>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
          睡眠の質
        </Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <MaterialCommunityIcons
                name={star <= rating ? 'star' : 'star-outline'}
                size={36}
                color="#FFB347"
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Button
        mode="contained"
        onPress={() =>
          onSubmit({
            startedAt: startTime,
            endedAt: endTime,
            durationMin,
            rating,
            note: note || undefined,
          })
        }
        style={styles.submit}
      >
        保存
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, padding: 16 },
  row: { flexDirection: 'row', gap: 8 },
  halfButton: { flex: 1 },
  duration: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#6C63FF',
  },
  ratingSection: { gap: 8 },
  stars: { flexDirection: 'row', gap: 4 },
  submit: { marginTop: 8 },
});
