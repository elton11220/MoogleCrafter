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
import {Provider as PaperProvider} from 'react-native-paper';
import Favorites from './pages/Favorites';
import MaterialList from './pages/MaterialList';
import {useColorScheme} from 'react-native';

const Tab = createMaterialBottomTabNavigator();

const App: FC = () => {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0)"
          barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
        />
        <NavigationContainer
          theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Tab.Navigator shifting={true}>
            <Tab.Screen
              name="Favorites"
              component={Favorites}
              options={{
                tabBarLabel: '收藏',
                tabBarIcon: ({color}) => (
                  <MaterialCommunityIcons
                    name="heart"
                    size={24}
                    color={color}
                  />
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
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
