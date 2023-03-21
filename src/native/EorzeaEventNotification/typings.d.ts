import 'react-native';

declare namespace EorzeaEventNotificationModule {
  interface NativeModuleStatic {
    isServiceReady: () => Promise<boolean>;
    bindService: () => void;
  }
}

declare module 'react-native' {
  interface NativeModulesStatic {
    EorzeaEventNotification: EorzeaEventNotificationModule.NativeModuleStatic;
  }
}
