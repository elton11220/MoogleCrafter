import 'react-native';

declare namespace BaiduMobStatModule {
  interface NativeModuleStatic {
    initStatService: () => void;
    initStatServiceInBrowseMode: () => void;
    onPageStart: (name: string) => void;
    onPageEnd: (name: string) => void;
    onEvent: (eventId: string, label: string) => void;
    onEventWithAttributes: (
      eventId: string,
      label: string,
      attributes: Record<string, string>,
    ) => void;
    onEventStart: (eventId: string, label: string) => void;
    onEventEnd: (eventId: string, label: string) => void;
    onEventEndWithAttributes: (
      eventId: string,
      label: string,
      attributes: Record<string, string>,
    ) => void;
    onEventDuration: (
      eventId: string,
      label: string,
      milliseconds: number,
    ) => void;
    onEventDurationWithAttributes: (
      eventId: string,
      label: string,
      milliseconds: number,
      attributes: Record<string, string>,
    ) => void;
  }
}

declare module 'react-native' {
  interface NativeModulesStatic {
    BaiduMobStat: BaiduMobStatModule.NativeModuleStatic;
  }
}
