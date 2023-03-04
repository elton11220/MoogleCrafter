import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {FC} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Provider as PaperProvider} from 'react-native-paper';
import Favorites from './pages/Favorites';
import MaterialList from './pages/MaterialList';
import {useColorScheme} from 'react-native';
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

const Tab = createMaterialBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator shifting={true}>
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

const App: FC = () => {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <PaperProvider
        theme={colorScheme === 'dark' ? DefaultDarkTheme : DefaultLightTheme}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0)"
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <NavigationContainer
          theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
