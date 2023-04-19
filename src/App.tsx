import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {useMemo} from 'react';
import type {FC} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Provider as PaperProvider} from 'react-native-paper';
import Favorites from './pages/Favorites';
import MaterialList from './pages/MaterialList';
import {
  DefaultDarkTheme,
  DefaultLightTheme,
} from './config/themes/defaultTheme';
import Settings from './pages/Settings';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import About from './pages/About';
import NotificationSettings from './pages/NotificationSettings';
import ThemeSettings from './pages/ThemeSettings';
import LanguageSettings from './pages/LanguageSettings';
import GeneralSettings from './pages/GeneralSettings';
import Detail from './pages/Detail';
import FullScreenReminder from './pages/FullScreenReminder';
import {useDarkMode} from './hooks/useDarkMode';
import {themeSettingsSelector, useStore} from './store';
import {adaptNavigationTheme} from './utils/themeAdapter';
import {DarkBlueTheme, LightBlueTheme} from './config/themes/blueTheme';
import {DarkPinkTheme, LightPinkTheme} from './config/themes/pinkTheme';
import {DarkGreenTheme, LightGreenTheme} from './config/themes/greenTheme';
import {DarkYellowTheme, LightYellowTheme} from './config/themes/yellowTheme';
import {DarkCyanTheme, LightCyanTheme} from './config/themes/cyanTheme';
import CheckPermission from './pages/CheckPermission';

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const App: FC = () => {
  const isDarkMode = useDarkMode();
  const {themeColor} = useStore(themeSettingsSelector);
  const darkTheme = useMemo(() => {
    if (themeColor === 'blue') {
      return DarkBlueTheme;
    } else if (themeColor === 'green') {
      return DarkGreenTheme;
    } else if (themeColor === 'pink') {
      return DarkPinkTheme;
    } else if (themeColor === 'yellow') {
      return DarkYellowTheme;
    } else if (themeColor === 'cyan') {
      return DarkCyanTheme;
    } else {
      return DefaultDarkTheme;
    }
  }, [themeColor]);
  const lightTheme = useMemo(() => {
    if (themeColor === 'blue') {
      return LightBlueTheme;
    } else if (themeColor === 'green') {
      return LightGreenTheme;
    } else if (themeColor === 'pink') {
      return LightPinkTheme;
    } else if (themeColor === 'yellow') {
      return LightYellowTheme;
    } else if (themeColor === 'cyan') {
      return LightCyanTheme;
    } else {
      return DefaultLightTheme;
    }
  }, [themeColor]);
  const adaptedNavTheme = useMemo(
    () =>
      adaptNavigationTheme({
        extendedMaterialLight: lightTheme,
        extendedMaterialDark: darkTheme,
      }),
    [darkTheme, lightTheme],
  );
  const HomeTabs = () => {
    return (
      <Tab.Navigator
        shifting={true}
        backBehavior="none"
        barStyle={{
          backgroundColor: isDarkMode
            ? darkTheme.colors.elevation.level2
            : lightTheme.colors.elevation.level2,
        }}>
        <Tab.Screen
          name="Favorites"
          component={Favorites}
          options={{
            tabBarLabel: '收藏',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons name="heart" size={24} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="MaterialList"
          component={MaterialList}
          options={{
            tabBarLabel: '素材',
            tabBarIcon: ({color}) => (
              <MaterialCommunityIcons
                name="format-list-bulleted"
                size={24}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: '设置',
            tabBarIcon: ({color}) => (
              <MaterialIcons name="settings" size={24} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  };
  return (
    <SafeAreaProvider>
      <PaperProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0)"
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <NavigationContainer
          theme={
            isDarkMode ? adaptedNavTheme.darkTheme : adaptedNavTheme.lightTheme
          }>
          <Stack.Navigator initialRouteName="HomeTabs">
            <Stack.Screen
              name="HomeTabs"
              component={HomeTabs}
              options={{
                headerShown: false,
                orientation: 'portrait',
                freezeOnBlur: true,
              }}
            />
            <Stack.Screen
              name="NotificationSettings"
              component={NotificationSettings}
              options={{
                headerShown: false,
                orientation: 'portrait',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="ThemeSettings"
              component={ThemeSettings}
              options={{
                headerShown: false,
                orientation: 'portrait',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="LanguageSettings"
              component={LanguageSettings}
              options={{
                headerShown: false,
                orientation: 'portrait',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="GeneralSettings"
              component={GeneralSettings}
              options={{
                headerShown: false,
                orientation: 'portrait',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="About"
              component={About}
              options={{
                headerShown: false,
                orientation: 'portrait',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="Detail"
              component={Detail}
              options={{
                headerShown: false,
                orientation: 'portrait',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="FullScreenReminder"
              component={FullScreenReminder}
              options={{
                headerShown: false,
                orientation: 'portrait',
                animation: 'fade',
                presentation: 'transparentModal',
              }}
            />
            <Stack.Screen
              name="CheckPermission"
              component={CheckPermission}
              options={{
                headerShown: false,
                orientation: 'portrait',
                animation: 'none',
                presentation: 'card',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
