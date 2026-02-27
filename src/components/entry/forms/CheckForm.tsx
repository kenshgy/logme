import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, TextInput, useTheme } from 'react-native-paper';
import { formatTimeFromDate } from '../../../utils/dateUtils';

interface Props {
  initialTime?: Date;
  initialNote?: string;
  onSubmit: (data: { startedAt: Date; note?: string }) => void;
}

export function CheckForm({ initialTime, initialNote = '', onSubmit }: Props) {
  const theme = useTheme();
  const [time, setTime] = useState(initialTime ?? new Date());
  const [note, setNote] = useState(initialNote);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      <Button
        mode="outlined"
        onPress={() => setShowPicker(true)}
        icon="clock-outline"
        style={styles.timeButton}
      >
        時刻: {formatTimeFromDate(time)}
      </Button>
      {showPicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour
          onChange={(_, date) => {
            setShowPicker(Platform.OS === 'ios');
            if (date) setTime(date);
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
        onPress={() => onSubmit({ startedAt: time, note: note || undefined })}
        style={styles.submit}
      >
        保存
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 16, padding: 16 },
  timeButton: { alignSelf: 'flex-start' },
  submit: { marginTop: 8 },
});
