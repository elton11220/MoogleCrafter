import 'react-native';

declare namespace NotificationManagerModule {
  interface NativeModuleStatic {
    openNotificationSettings: () => void;
    areNotificationsEnabled: () => Promise<boolean>;
  }
}

declare module 'react-native' {
  interface NativeModulesStatic {
    NotificationManager: NotificationManagerModule.NativeModuleStatic;
  }
}
