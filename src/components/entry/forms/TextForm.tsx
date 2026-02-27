import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { formatTimeFromDate } from '../../../utils/dateUtils';

interface Props {
  initialText?: string;
  initialTime?: Date;
  initialNote?: string;
  onSubmit: (data: { textValue: string; startedAt: Date; note?: string }) => void;
}

export function TextForm({ initialText = '', initialTime, initialNote = '', onSubmit }: Props) {
  const [text, setText] = useState(initialText);
  const [time, setTime] = useState(initialTime ?? new Date());
  const [note, setNote] = useState(initialNote);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        label="内容"
        value={text}
        onChangeText={setText}
        mode="outlined"
        multiline
        numberOfLines={5}
        placeholder="メモを入力してください..."
      />
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
      <Button
        mode="contained"
        onPress={() => onSubmit({ textValue: text, startedAt: time, note: note || undefined })}
        disabled={!text.trim()}
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
