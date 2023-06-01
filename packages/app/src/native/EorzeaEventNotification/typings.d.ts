import 'react-native';

declare namespace EorzeaEventNotificationModule {
  interface NativeModuleStatic {
    isServiceReady: () => Promise<boolean>;
    bindService: () => void;
    addSubscription: (gatheringItemsJson: string) => void;
    removeSubscription: (gatheringItemsJson: string) => void;
  }
}

declare module 'react-native' {
  interface NativeModulesStatic {
    EorzeaEventNotification: EorzeaEventNotificationModule.NativeModuleStatic;
  }
}
