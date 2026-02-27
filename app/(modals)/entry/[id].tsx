import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EntryFormRouter } from '../../../src/components/entry/EntryFormRouter';
import { getEntryById, deleteEntry } from '../../../src/db/queries/entries';
import { Category, LogEntry } from '../../../src/db/schema';

export default function EditEntryModal() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [entry, setEntry] = useState<LogEntry | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getEntryById(Number(id))
        .then((result) => {
          if (result) {
            setEntry(result.log_entries);
            setCategory(result.categories);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleDelete = () => {
    Alert.alert('削除', 'この記録を削除しますか？', [
      { text: 'キャンセル', style: 'cancel' },
      {
        text: '削除',
        style: 'destructive',
        onPress: async () => {
          await deleteEntry(Number(id));
          router.back();
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!entry || !category) {
    router.back();
    return null;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top', 'bottom']}
    >
      <Appbar.Header style={{ backgroundColor: theme.colors.surface }}>
        <Appbar.Action icon="close" onPress={() => router.back()} />
        <Appbar.Content title={category.name + ' を編集'} />
        <Appbar.Action icon="delete" iconColor={theme.colors.error} onPress={handleDelete} />
      </Appbar.Header>
      <EntryFormRouter
        category={category}
        existingEntry={entry}
        onDone={() => router.back()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
