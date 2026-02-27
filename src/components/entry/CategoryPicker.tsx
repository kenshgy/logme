import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Category } from '../../db/schema';

interface Props {
  categories: Category[];
  onSelect: (category: Category) => void;
}

export function CategoryPicker({ categories, onSelect }: Props) {
  const theme = useTheme();

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => String(item.id)}
      numColumns={4}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => onSelect(item)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrapper, { backgroundColor: item.color + '25' }]}>
            <MaterialCommunityIcons name={item.icon as any} size={28} color={item.color} />
          </View>
          <Text
            variant="bodySmall"
            style={[styles.label, { color: theme.colors.onSurface }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
      contentContainerStyle={styles.grid}
    />
  );
}

const styles = StyleSheet.create({
  grid: {
    padding: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    padding: 8,
    gap: 4,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    textAlign: 'center',
    fontSize: 11,
  },
});
