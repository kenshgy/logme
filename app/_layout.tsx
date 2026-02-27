import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { db } from '../src/db/client';
import migrationsConfig from '../src/db/migrations/index';
import { seedDefaultCategories } from '../src/db/queries/seeds';
import { darkTheme, lightTheme } from '../src/theme/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const { success: migrationSuccess, error: migrationError } = useMigrations(db, migrationsConfig);
  const [seeded, setSeeded] = useState(false);

  const [loaded] = useFonts({});

  useEffect(() => {
    if (migrationSuccess && !seeded) {
      seedDefaultCategories()
        .then(() => setSeeded(true))
        .catch(console.error);
    }
  }, [migrationSuccess]);

  useEffect(() => {
    if (loaded && (seeded || migrationError)) {
      SplashScreen.hideAsync();
    }
  }, [loaded, seeded, migrationError]);

  if (!loaded || (!seeded && !migrationError)) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)/entry/new"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen
            name="(modals)/entry/[id]"
            options={{ presentation: 'modal', headerShown: false }}
          />
          <Stack.Screen
            name="(modals)/settings/index"
            options={{ presentation: 'modal', title: '設定' }}
          />
          <Stack.Screen
            name="(modals)/settings/categories"
            options={{ title: 'カテゴリ管理' }}
          />
          <Stack.Screen
            name="(modals)/settings/category/new"
            options={{ title: '新規カテゴリ' }}
          />
          <Stack.Screen
            name="(modals)/settings/category/[id]"
            options={{ title: 'カテゴリ編集' }}
          />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
