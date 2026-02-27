import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import { Category, LogEntry } from '../../db/schema';
import { formatTime } from '../../utils/dateUtils';
import { minutesToDisplay } from '../../utils/durationUtils';

interface Props {
  entry: LogEntry;
  category: Category;
  onPress: () => void;
}

function getEntryValue(entry: LogEntry, category: Category): string {
  switch (category.inputType) {
    case 'sleep':
      return entry.durationMin ? minutesToDisplay(entry.durationMin) : '';
    case 'duration':
      return entry.durationMin ? minutesToDisplay(entry.durationMin) : '';
    case 'numeric':
      return entry.numericValue != null
        ? `${entry.numericValue}${category.unit ? ' ' + category.unit : ''}`
        : '';
    case 'weight':
      return entry.numericValue != null ? `${entry.numericValue} kg` : '';
    case 'meal':
      return entry.textValue ?? '';
    case 'text':
      return entry.textValue ?? '';
    case 'check':
      return '';
    default:
      return '';
  }
}

function getTimeDisplay(entry: LogEntry, category: Category): string {
  if (entry.startedAt && entry.endedAt) {
    return `${formatTime(entry.startedAt)} - ${formatTime(entry.endedAt)}`;
  }
  if (entry.startedAt) {
    return formatTime(entry.startedAt);
  }
  return '';
}

export function TimelineEntry({ entry, category, onPress }: Props) {
  const theme = useTheme();
  const value = getEntryValue(entry, category);
  const timeDisplay = getTimeDisplay(entry, category);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Surface style={[styles.card, { backgroundColor: theme.colors.surface }]} elevation={1}>
        <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
          <MaterialCommunityIcons
            name={category.icon as any}
            size={24}
            color={category.color}
          />
        </View>
        <View style={styles.content}>
          <Text variant="labelLarge" style={{ color: theme.colors.onSurface }}>
            {category.name}
          </Text>
          {value ? (
            <Text variant="bodyLarge" style={{ color: category.color, fontWeight: '600' }}>
              {value}
            </Text>
          ) : null}
          {entry.note ? (
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
              numberOfLines={1}
            >
              {entry.note}
            </Text>
          ) : null}
        </View>
        <View style={styles.timeContainer}>
          {timeDisplay ? (
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {timeDisplay}
            </Text>
          ) : null}
          {entry.rating ? (
            <View style={styles.rating}>
              {Array.from({ length: 5 }).map((_, i) => (
                <MaterialCommunityIcons
                  key={i}
                  name="star"
                  size={10}
                  color={i < entry.rating! ? '#FFB347' : theme.colors.outline}
                />
              ))}
            </View>
          ) : null}
        </View>
      </Surface>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  timeContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rating: {
    flexDirection: 'row',
    gap: 1,
  },
});
