import {NativeModules} from 'react-native';

export const openNotificationSettings =
  NativeModules.NotificationManager.openNotificationSettings;

export const getNotificationsEnabledStatus =
  NativeModules.NotificationManager.getNotificationsEnabledStatus;
