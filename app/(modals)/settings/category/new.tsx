import { router } from 'expo-router';
import React from 'react';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryForm } from '../../../../src/components/settings/CategoryForm';
import { createCategory } from '../../../../src/db/queries/categories';

export default function NewCategoryScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['bottom']}
    >
      <CategoryForm
        onSubmit={async (data) => {
          await createCategory({
            name: data.name,
            icon: data.icon,
            color: data.color,
            inputType: data.inputType,
            unit: data.unit ?? null,
            sortOrder: 999,
            isSystem: false,
            isActive: true,
          });
          router.back();
        }}
        submitLabel="作成"
      />
    </SafeAreaView>
  );
}
