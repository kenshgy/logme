import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, SegmentedButtons, Surface, Text, TextInput, useTheme } from 'react-native-paper';
import { Category, InputType } from '../../db/schema';

const ICON_OPTIONS = [
  'star', 'heart', 'run', 'bike', 'walk', 'swim', 'dumbbell', 'yoga',
  'sleep', 'weather-sunny', 'silverware-fork-knife', 'water', 'scale-bathroom',
  'briefcase', 'broom', 'cart', 'shower', 'pill', 'emoticon-happy', 'note-text',
  'car', 'bus', 'airplane', 'home', 'hospital', 'school', 'music', 'book',
  'television', 'phone', 'camera', 'coffee', 'beer', 'food-apple', 'leaf',
];

const COLOR_OPTIONS = [
  '#6C63FF', '#FF6B6B', '#4ECDC4', '#FFB347', '#96CEB4', '#45B7D1',
  '#5B7FA6', '#F7DC6F', '#E8A0BF', '#A29BFE', '#FD79A8', '#FFEAA7',
  '#B2BABB', '#00CEC9', '#E17055', '#D63031', '#6C5CE7', '#00B894',
  '#FDCB6E', '#74B9FF', '#55EFC4', '#FAB1A0', '#DFE6E9', '#2D3436',
];

const INPUT_TYPES: Array<{ value: InputType; label: string }> = [
  { value: 'check', label: 'チェック' },
  { value: 'duration', label: '時間' },
  { value: 'numeric', label: '数値' },
  { value: 'text', label: 'テキスト' },
  { value: 'sleep', label: '睡眠' },
  { value: 'meal', label: '食事' },
  { value: 'weight', label: '体重' },
];

interface Props {
  initialData?: Partial<Category>;
  onSubmit: (data: {
    name: string;
    icon: string;
    color: string;
    inputType: InputType;
    unit?: string;
  }) => void;
  submitLabel?: string;
}

export function CategoryForm({ initialData, onSubmit, submitLabel = '保存' }: Props) {
  const theme = useTheme();
  const [name, setName] = useState(initialData?.name ?? '');
  const [icon, setIcon] = useState(initialData?.icon ?? 'star');
  const [color, setColor] = useState(initialData?.color ?? '#6C63FF');
  const [inputType, setInputType] = useState<InputType>(initialData?.inputType ?? 'check');
  const [unit, setUnit] = useState(initialData?.unit ?? '');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="カテゴリ名"
        value={name}
        onChangeText={setName}
        mode="outlined"
        maxLength={20}
      />

      <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
        アイコン
      </Text>
      <View style={styles.iconGrid}>
        {ICON_OPTIONS.map((ic) => (
          <TouchableOpacity
            key={ic}
            onPress={() => setIcon(ic)}
            style={[
              styles.iconOption,
              {
                backgroundColor: ic === icon ? color + '30' : theme.colors.surfaceVariant,
                borderColor: ic === icon ? color : 'transparent',
                borderWidth: 2,
              },
            ]}
          >
            <MaterialCommunityIcons name={ic as any} size={24} color={ic === icon ? color : theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        ))}
      </View>

      <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
        カラー
      </Text>
      <View style={styles.colorGrid}>
        {COLOR_OPTIONS.map((c) => (
          <TouchableOpacity
            key={c}
            onPress={() => setColor(c)}
            style={[
              styles.colorOption,
              { backgroundColor: c },
              c === color && styles.colorSelected,
            ]}
          >
            {c === color && (
              <MaterialCommunityIcons name="check" size={16} color="#fff" />
            )}
          </TouchableOpacity>
        ))}
      </View>

      <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
        入力タイプ
      </Text>
      <View style={styles.typeGrid}>
        {INPUT_TYPES.map((t) => (
          <TouchableOpacity
            key={t.value}
            onPress={() => setInputType(t.value)}
            style={[
              styles.typeOption,
              {
                backgroundColor: t.value === inputType ? theme.colors.primary : theme.colors.surfaceVariant,
              },
            ]}
          >
            <Text
              variant="labelMedium"
              style={{ color: t.value === inputType ? '#fff' : theme.colors.onSurfaceVariant }}
            >
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {(inputType === 'numeric' || inputType === 'weight') && (
        <TextInput
          label="単位（任意）"
          value={unit}
          onChangeText={setUnit}
          mode="outlined"
          placeholder="例: kg, km, ml"
        />
      )}

      <Button
        mode="contained"
        onPress={() =>
          onSubmit({ name, icon, color, inputType, unit: unit || undefined })
        }
        disabled={!name.trim()}
        style={{ marginTop: 8 }}
      >
        {submitLabel}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
});
