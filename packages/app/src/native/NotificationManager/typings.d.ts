import 'react-native';

declare namespace NotificationManagerModule {
  interface NotificationsEnabledStatus {
    areNotificationsEnabled: boolean;
    isENSChannelEnabled: boolean;
    isENChannelEnabled: boolean;
  }

  interface NativeModuleStatic {
    openNotificationSettings: () => void;
    getNotificationsEnabledStatus: () => Promise<NotificationsEnabledStatus>;
  }
}

declare module 'react-native' {
  interface NativeModulesStatic {
    NotificationManager: NotificationManagerModule.NativeModuleStatic;
  }
}
