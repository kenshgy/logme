import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { ActivityIndicator, Button, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryForm } from '../../../../src/components/settings/CategoryForm';
import { getAllCategories, updateCategory, deleteOrDeactivateCategory } from '../../../../src/db/queries/categories';
import { Category } from '../../../../src/db/schema';

export default function EditCategoryScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllCategories()
      .then((cats) => {
        const found = cats.find((c) => c.id === Number(id));
        setCategory(found ?? null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!category) {
    router.back();
    return null;
  }

  const handleDelete = () => {
    Alert.alert(
      'カテゴリを削除',
      'このカテゴリを削除しますか？記録が存在する場合は非表示になります。',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            await deleteOrDeactivateCategory(Number(id));
            router.back();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['bottom']}
    >
      <CategoryForm
        initialData={category}
        onSubmit={async (data) => {
          await updateCategory(Number(id), {
            name: data.name,
            icon: data.icon,
            color: data.color,
            inputType: data.inputType,
            unit: data.unit ?? null,
          });
          router.back();
        }}
      />
      {!category.isSystem && (
        <Button
          mode="text"
          textColor={theme.colors.error}
          onPress={handleDelete}
          style={{ margin: 16 }}
        >
          カテゴリを削除
        </Button>
      )}
      <Button
        mode="text"
        onPress={() => updateCategory(Number(id), { isActive: !category.isActive }).then(() => router.back())}
        style={{ marginHorizontal: 16, marginBottom: 8 }}
      >
        {category.isActive ? '非表示にする' : '表示する'}
      </Button>
    </SafeAreaView>
  );
}
