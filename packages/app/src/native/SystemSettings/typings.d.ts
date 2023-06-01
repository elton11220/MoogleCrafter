import 'react-native';

declare namespace SystemSettingsModule {
  interface NativeModuleStatic {
    openScheduleExactAlarmSettings: () => Promise<null> | never;
    openApplicationDetailsSettings: () => void;
    openChannelNotificationSettings: () => void;
    openIgnoreBatteryOptimizationSettings: () => void;
  }
}

declare module 'react-native' {
  interface NativeModulesStatic {
    SystemSettings: SystemSettingsModule.NativeModuleStatic;
  }
}
