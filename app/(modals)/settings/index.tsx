import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Divider, List, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['bottom']}
    >
      <ScrollView>
        <List.Section>
          <List.Subheader>記録</List.Subheader>
          <List.Item
            title="カテゴリ管理"
            description="カテゴリの追加・編集・並替"
            left={(props) => <List.Icon {...props} icon="tag-multiple" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/(modals)/settings/categories')}
          />
        </List.Section>
        <Divider />
        <List.Section>
          <List.Subheader>アプリについて</List.Subheader>
          <List.Item
            title="バージョン"
            description="1.0.0"
            left={(props) => <List.Icon {...props} icon="information" />}
          />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
