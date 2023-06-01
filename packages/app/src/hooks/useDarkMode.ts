import {useMemo} from 'react';
import {useColorScheme} from 'react-native';
import {themeSettingsSelector, useStore} from '../store';

export function useDarkMode() {
  const colorScheme = useColorScheme();
  const {darkModeFollowOS, enableDarkMode} = useStore(themeSettingsSelector);
  const isDarkMode = useMemo(() => {
    if (darkModeFollowOS) {
      return colorScheme === 'dark';
    } else {
      return enableDarkMode;
    }
  }, [colorScheme, darkModeFollowOS, enableDarkMode]);
  return isDarkMode;
}
