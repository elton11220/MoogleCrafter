import {NativeModules} from 'react-native';

export function openAppDetailsInAppMarket() {
  NativeModules.AppMarket.openAppDetailsInAppMarket();
}
