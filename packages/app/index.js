/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import {enableMapSet} from 'immer';

enableMapSet();

AppRegistry.registerComponent(appName, () => App);
