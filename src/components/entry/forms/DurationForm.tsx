import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { formatTimeFromDate } from '../../../utils/dateUtils';
import { minutesToDisplay } from '../../../utils/durationUtils';

interface Props {
  initialStart?: Date;
  initialEnd?: Date;
  initialNote?: string;
  onSubmit: (data: { startedAt: Date; endedAt: Date; durationMin: number; note?: string }) => void;
}

export function DurationForm({ initialStart, initialEnd, initialNote = '', onSubmit }: Props) {
  const [startTime, setStartTime] = useState(initialStart ?? new Date());
  const [endTime, setEndTime] = useState(initialEnd ?? new Date());
  const [note, setNote] = useState(initialNote);
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const durationMin = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
  const isValid = durationMin > 0;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Button
          mode="outlined"
          onPress={() => setShowStart(true)}
          icon="clock-start"
          style={styles.halfButton}
        >
          開始: {formatTimeFromDate(startTime)}
        </Button>
        <Button
          mode="outlined"
          onPress={() => setShowEnd(true)}
          icon="clock-end"
          style={styles.halfButton}
        >
          終了: {formatTimeFromDate(endTime)}
        </Button>
      </View>
      {isValid && (
        <Text variant="bodyMedium" style={styles.duration}>
          所要時間: {minutesToDisplay(durationMin)}
        </Text>
      )}
      {!isValid && (
        <Text variant="bodySmall" style={styles.error}>
          終了時刻は開始時刻より後にしてください
        </Text>
      )}
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
      <TextInput
        label="メモ（任意）"
        value={note}
        onChangeText={setNote}
        mode="outlined"
        multiline
        numberOfLines={3}
      />
      <Button
        mode="contained"
        onPress={() =>
          onSubmit({ startedAt: startTime, endedAt: endTime, durationMin, note: note || undefined })
        }
        disabled={!isValid}
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
  duration: { textAlign: 'center', fontWeight: '600', color: '#6C63FF' },
  error: { textAlign: 'center', color: '#B00020' },
  submit: { marginTop: 8 },
});
