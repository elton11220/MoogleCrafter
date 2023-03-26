import {MD3DarkTheme, MD3LightTheme} from 'react-native-paper';
import type {DefaultDarkTheme, DefaultLightTheme} from './defaultTheme';
import {extendedDarkColors, extendedLightColors} from './extension';

export const LightBlueTheme: typeof DefaultLightTheme = {
  ...MD3LightTheme,
  colors: {
    primary: '#315da8',
    onPrimary: '#ffffff',
    primaryContainer: '#d8e2ff',
    onPrimaryContainer: '#001a41',
    secondary: '#565e71',
    onSecondary: '#ffffff',
    secondaryContainer: '#dbe2f9',
    onSecondaryContainer: '#141b2c',
    tertiary: '#715573',
    onTertiary: '#ffffff',
    tertiaryContainer: '#fbd7fc',
    onTertiaryContainer: '#29132d',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#410002',
    background: '#fefbff',
    onBackground: '#1b1b1f',
    surface: '#fefbff',
    onSurface: '#1b1b1f',
    surfaceVariant: '#e1e2ec',
    onSurfaceVariant: '#44474f',
    outline: '#74777f',
    outlineVariant: '#c4c6d0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#303033',
    inverseOnSurface: '#f2f0f4',
    inversePrimary: '#adc6ff',
    elevation: {
      level0: 'transparent',
      level1: '#f9f9ff',
      level2: '#edf0ff',
      level3: '#d8e2ff',
      level4: '#adc6ff',
      level5: '#82abfb',
    },
    surfaceDisabled: 'rgba(27, 27, 31, 0.12)',
    onSurfaceDisabled: 'rgba(27, 27, 31, 0.38)',
    backdrop: 'rgba(48, 48, 56, 0.4)',
    ...extendedLightColors,
  },
};

export const DarkBlueTheme: typeof DefaultDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    primary: '#adc6ff',
    onPrimary: '#002e69',
    primaryContainer: '#0e448e',
    onPrimaryContainer: '#d8e2ff',
    secondary: '#bfc6dc',
    onSecondary: '#293041',
    secondaryContainer: '#3f4759',
    onSecondaryContainer: '#dbe2f9',
    tertiary: '#debcdf',
    onTertiary: '#402843',
    tertiaryContainer: '#583e5b',
    onTertiaryContainer: '#fbd7fc',
    error: '#ffb4ab',
    onError: '#93000a',
    errorContainer: '#690005',
    onErrorContainer: '#ffdad6',
    background: '#1b1b1f',
    onBackground: '#e3e2e6',
    surface: '#1b1b1f',
    onSurface: '#e3e2e6',
    surfaceVariant: '#44474f',
    onSurfaceVariant: '#c4c6d0',
    outline: '#8e9099',
    outlineVariant: '#44474f',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#e3e2e6',
    inverseOnSurface: '#1b1b1f',
    inversePrimary: '#1d5cb7',
    elevation: {
      level0: 'transparent',
      level1: '#1b1b1f',
      level2: '#303033',
      level3: '#3b3b3f',
      level4: '#46464a',
      level5: '#525256',
    },
    surfaceDisabled: 'rgba(229, 225, 230, 0.12)',
    onSurfaceDisabled: 'rgba(229, 225, 230, 0.38)',
    backdrop: 'rgba(48, 48, 56, 0.4)',
    ...extendedDarkColors,
  },
};
