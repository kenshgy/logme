import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryPicker } from '../../../src/components/entry/CategoryPicker';
import { EntryFormRouter } from '../../../src/components/entry/EntryFormRouter';
import { useCategories } from '../../../src/hooks/useCategories';
import { Category } from '../../../src/db/schema';

export default function NewEntryModal() {
  const theme = useTheme();
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleClose = () => router.back();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'bottom']}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Action icon="close" onPress={handleClose} />
        <Appbar.Content
          title={selectedCategory ? selectedCategory.name : '記録を追加'}
        />
        {selectedCategory && (
          <Appbar.Action
            icon="arrow-left"
            onPress={() => setSelectedCategory(null)}
          />
        )}
      </Appbar.Header>

      {!selectedCategory ? (
        <View style={styles.pickerContainer}>
          <Text
            variant="bodyMedium"
            style={{ color: theme.colors.onSurfaceVariant, padding: 16 }}
          >
            カテゴリを選択してください
          </Text>
          <CategoryPicker
            categories={categories}
            onSelect={setSelectedCategory}
          />
        </View>
      ) : (
        <EntryFormRouter
          category={selectedCategory}
          onDone={handleClose}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  pickerContainer: { flex: 1 },
});
