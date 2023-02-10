import {MD3DarkTheme, MD3LightTheme} from 'react-native-paper';
import {extendedDarkColors, extendedLightColors} from './extension';

export const DefaultLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...extendedLightColors,
  },
};

export const DefaultDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    ...extendedDarkColors,
  },
};
