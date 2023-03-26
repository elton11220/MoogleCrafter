import {MD3DarkTheme, MD3LightTheme} from 'react-native-paper';
import type {DefaultDarkTheme, DefaultLightTheme} from './defaultTheme';
import {extendedDarkColors, extendedLightColors} from './extension';

export const LightCyanTheme: typeof DefaultLightTheme = {
  ...MD3LightTheme,
  colors: {
    primary: '#006874',
    onPrimary: '#ffffff',
    primaryContainer: '#97f0ff',
    onPrimaryContainer: '#001f24',
    secondary: '#4a6267',
    onSecondary: '#ffffff',
    secondaryContainer: '#cde7ec',
    onSecondaryContainer: '#051f23',
    tertiary: '#525e7d',
    onTertiary: '#ffffff',
    tertiaryContainer: '#dae2ff',
    onTertiaryContainer: '#0e1b37',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#410002',
    background: '#fafdfd',
    onBackground: '#191c1d',
    surface: '#fafdfd',
    onSurface: '#191c1d',
    surfaceVariant: '#dbe4e6',
    onSurfaceVariant: '#3f484a',
    outline: '#6f797a',
    outlineVariant: '#bfc8ca',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#2e3132',
    inverseOnSurface: '#eff1f1',
    inversePrimary: '#4fd8eb',
    elevation: {
      level0: 'transparent',
      level1: '#f6feff',
      level2: '#edfcff',
      level3: '#d0f8ff',
      level4: '#97f0ff',
      level5: '#4fd8eb',
    },
    surfaceDisabled: 'rgba(27, 27, 31, 0.12)',
    onSurfaceDisabled: 'rgba(27, 27, 31, 0.38)',
    backdrop: 'rgba(48, 48, 56, 0.4)',
    ...extendedLightColors,
  },
};

export const DarkCyanTheme: typeof DefaultDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    primary: '#4fd8eb',
    onPrimary: '#00363d',
    primaryContainer: '#004f58',
    onPrimaryContainer: '#97f0ff',
    secondary: '#b1cbd0',
    onSecondary: '#1c3438',
    secondaryContainer: '#334b4f',
    onSecondaryContainer: '#cde7ec',
    tertiary: '#bac6ea',
    onTertiary: '#24304d',
    tertiaryContainer: '#3b4664',
    onTertiaryContainer: '#dae2ff',
    error: '#ffb4ab',
    onError: '#93000a',
    errorContainer: '#690005',
    onErrorContainer: '#ffdad6',
    background: '#191c1d',
    onBackground: '#e1e3e3',
    surface: '#191c1d',
    onSurface: '#e1e3e3',
    surfaceVariant: '#3f484a',
    onSurfaceVariant: '#bfc8ca',
    outline: '#899294',
    outlineVariant: '#3f484a',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#e1e3e3',
    inverseOnSurface: '#191c1d',
    inversePrimary: '#006874',
    elevation: {
      level0: 'transparent',
      level1: '#191c1d',
      level2: '#2e3132',
      level3: '#393c3d',
      level4: '#444748',
      level5: '#505354',
    },
    surfaceDisabled: 'rgba(229, 225, 230, 0.12)',
    onSurfaceDisabled: 'rgba(229, 225, 230, 0.38)',
    backdrop: 'rgba(48, 48, 56, 0.4)',
    ...extendedDarkColors,
  },
};
