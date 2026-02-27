import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FAB, Surface, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { asc } from 'drizzle-orm';
import { db } from '../../../src/db/client';
import { categories } from '../../../src/db/schema';
import { updateCategory, deleteOrDeactivateCategory } from '../../../src/db/queries/categories';

export default function CategoriesScreen() {
  const theme = useTheme();
  const { data } = useLiveQuery(
    db.select().from(categories).orderBy(asc(categories.sortOrder))
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      <FlatList
        data={data ?? []}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push(`/(modals)/settings/category/${item.id}`)}>
            <Surface style={[styles.item, { opacity: item.isActive ? 1 : 0.4 }]} elevation={1}>
              <View
                style={[styles.iconWrapper, { backgroundColor: item.color + '25' }]}
              >
                <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
              </View>
              <View style={styles.info}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                  {item.name}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {item.inputType}
                  {item.isSystem ? ' • システム' : ''}
                  {!item.isActive ? ' • 非表示' : ''}
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
            </Surface>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingVertical: 8, paddingBottom: 80 }}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        color={theme.colors.onPrimary}
        onPress={() => router.push('/(modals)/settings/category/new')}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1 },
  fab: { position: 'absolute', bottom: 24, right: 24 },
});
