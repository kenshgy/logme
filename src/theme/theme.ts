import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { palette } from './colors';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    primaryContainer: palette.primaryLight,
    secondary: palette.secondary,
    secondaryContainer: '#FFD2D2',
    tertiary: palette.accent,
    background: palette.background,
    surface: palette.surface,
    surfaceVariant: palette.surfaceVariant,
    onPrimary: palette.onPrimary,
    onBackground: palette.onBackground,
    onSurface: palette.onSurface,
    onSurfaceVariant: palette.onSurfaceVariant,
    outline: palette.outline,
    error: palette.error,
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: palette.primaryLight,
    primaryContainer: '#3D3A6B',
    secondary: '#FF8A8A',
    secondaryContainer: '#6B2828',
    tertiary: palette.accent,
    background: palette.darkBackground,
    surface: palette.darkSurface,
    surfaceVariant: palette.darkSurfaceVariant,
    onBackground: palette.darkOnBackground,
    onSurface: palette.darkOnSurface,
    onSurfaceVariant: '#ABABAB',
    outline: palette.darkOutline,
    error: '#CF6679',
  },
};

export type AppTheme = typeof lightTheme;
