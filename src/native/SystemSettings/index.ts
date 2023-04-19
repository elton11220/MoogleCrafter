import {NativeModules} from 'react-native';

export function openScheduleExactAlarmSettings() {
  return NativeModules.SystemSettings.openScheduleExactAlarmSettings();
}

export const openApplicationDetailsSettings =
  NativeModules.SystemSettings.openApplicationDetailsSettings;

export const openChannelNotificationSettings =
  NativeModules.SystemSettings.openChannelNotificationSettings;

export const openIgnoreBatteryOptimizationSettings =
  NativeModules.SystemSettings.openIgnoreBatteryOptimizationSettings;
