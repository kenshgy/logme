import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { formatTimeFromDate } from '../../../utils/dateUtils';

interface Props {
  initialText?: string;
  initialCalories?: number;
  initialTime?: Date;
  initialNote?: string;
  onSubmit: (data: {
    textValue: string;
    numericValue?: number;
    startedAt: Date;
    note?: string;
  }) => void;
}

export function MealForm({ initialText = '', initialCalories, initialTime, initialNote = '', onSubmit }: Props) {
  const [text, setText] = useState(initialText);
  const [calories, setCalories] = useState(initialCalories?.toString() ?? '');
  const [time, setTime] = useState(initialTime ?? new Date());
  const [note, setNote] = useState(initialNote);
  const [showPicker, setShowPicker] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        label="食事内容"
        value={text}
        onChangeText={setText}
        mode="outlined"
        multiline
        numberOfLines={3}
        placeholder="例: 朝食、ご飯、味噌汁、卵焼き"
      />
      <TextInput
        label="カロリー (kcal)（任意）"
        value={calories}
        onChangeText={setCalories}
        mode="outlined"
        keyboardType="decimal-pad"
        right={<TextInput.Affix text="kcal" />}
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
      <TextInput
        label="メモ（任意）"
        value={note}
        onChangeText={setNote}
        mode="outlined"
        multiline
        numberOfLines={2}
      />
      <Button
        mode="contained"
        onPress={() =>
          onSubmit({
            textValue: text,
            numericValue: calories ? parseFloat(calories) : undefined,
            startedAt: time,
            note: note || undefined,
          })
        }
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
