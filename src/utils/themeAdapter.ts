import type {
  DefaultDarkTheme,
  DefaultLightTheme,
} from '../config/themes/defaultTheme';

const getAdaptedNavigationTheme = (materialTheme: typeof DefaultLightTheme) => {
  return {
    dark: materialTheme.dark,
    colors: {
      primary: materialTheme.colors.primary,
      background: materialTheme.colors.background,
      card: materialTheme.colors.elevation.level2,
      text: materialTheme.colors.onSurface,
      border: materialTheme.colors.outline,
      notification: materialTheme.colors.error,
    },
  };
};

export function adaptNavigationTheme(themes: {
  extendedMaterialLight: typeof DefaultLightTheme;
  extendedMaterialDark: typeof DefaultDarkTheme;
}) {
  const {extendedMaterialLight, extendedMaterialDark} = themes;
  return {
    lightTheme: getAdaptedNavigationTheme(extendedMaterialLight),
    darkTheme: getAdaptedNavigationTheme(extendedMaterialDark),
  };
}
