import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, TextInput } from 'react-native-paper';
import { formatTimeFromDate } from '../../../utils/dateUtils';

interface Props {
  initialValue?: number;
  initialUnit?: 'kg' | 'lb';
  initialTime?: Date;
  initialNote?: string;
  onSubmit: (data: { numericValue: number; textValue: string; startedAt: Date; note?: string }) => void;
}

export function WeightForm({ initialValue, initialUnit = 'kg', initialTime, initialNote = '', onSubmit }: Props) {
  const [value, setValue] = useState(initialValue?.toString() ?? '');
  const [unit, setUnit] = useState<'kg' | 'lb'>(initialUnit);
  const [time, setTime] = useState(initialTime ?? new Date());
  const [note, setNote] = useState(initialNote);
  const [showPicker, setShowPicker] = useState(false);

  const numValue = parseFloat(value);
  const isValid = !isNaN(numValue) && numValue > 0;

  return (
    <View style={styles.container}>
      <TextInput
        label={`体重 (${unit})`}
        value={value}
        onChangeText={setValue}
        mode="outlined"
        keyboardType="decimal-pad"
        right={<TextInput.Affix text={unit} />}
      />
      <SegmentedButtons
        value={unit}
        onValueChange={(v) => setUnit(v as 'kg' | 'lb')}
        buttons={[
          { value: 'kg', label: 'kg' },
          { value: 'lb', label: 'lb' },
        ]}
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
      />
      <Button
        mode="contained"
        onPress={() =>
          onSubmit({
            numericValue: numValue,
            textValue: unit,
            startedAt: time,
            note: note || undefined,
          })
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
  timeButton: { alignSelf: 'flex-start' },
  submit: { marginTop: 8 },
});
