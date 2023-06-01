import 'react-native';

declare namespace AppMarketModule {
  interface NativeModuleStatic {
    openAppDetailsInAppMarket: () => void;
  }
}

declare module 'react-native' {
  interface NativeModulesStatic {
    AppMarket: AppMarketModule.NativeModuleStatic;
  }
}
