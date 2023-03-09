declare namespace ZustandStore {
  type InAppRingtoneType = 'simple' | 'tts' | 'exVersion';

  interface NotificationSettings {
    enableRingtone: boolean;
    enableVibration: boolean;
    enableFullScreen: boolean;
    inAppRingtoneType: InAppRingtoneType;
  }

  type ThemeKey =
    | 'purple'
    | 'blue'
    | 'green'
    | 'red'
    | 'yellow'
    | 'brown'
    | 'darkRed';

  interface ThemeSettings {
    themeColor: ThemeKey;
    darkModeFollowOS: boolean;
    enableDarkMode: boolean;
  }

  type UiLang = 'zh-cn' | 'en-us';
  type ResLang = 'zh-cn' | 'en-us' | 'ja-jp';

  interface LanguageSettings {
    uiLang: UiLang;
    resLang: ResLang;
  }

  interface GeneralSettings {
    enableEorzeaTimeDisplayer: boolean;
    enableGatheringItemGesture: boolean;
    enableFFCafeMapInDetail: boolean;
    showAllItemsOfGatheringPoint: boolean;
    enableFFCafeMapInFullScreen: boolean;
  }

  interface Action {
    hideSplashScreen: () => void;
    updateNotificationSettings: <
      T extends keyof ZustandStore.NotificationSettings,
    >(
      key: T,
      value: ZustandStore.NotificationSettings[T],
    ) => void;
    updateThemeSettings: <T extends keyof ZustandStore.ThemeSettings>(
      key: T,
      value: ZustandStore.ThemeSettings[T],
    ) => void;
    updateLanguageSettings: <T extends keyof ZustandStore.LanguageSettings>(
      key: T,
      value: ZustandStore.LanguageSettings[T],
    ) => void;
    updateGeneralSettings: <T extends keyof ZustandStore.GeneralSettings>(
      key: T,
      value: ZustandStore.GeneralSettings[T],
    ) => void;
  }

  interface State {
    gatheringItems: AppGlobal.GatheringItem[];
    gatheringPointBases: AppGlobal.GatheringPointBase[];
    regions: AppGlobal.RegionItem[];
    isSplashScreenShow: boolean;
    settings: {
      notificationSettings: NotificationSettings;
      themeSettings: ThemeSettings;
      languageSettings: LanguageSettings;
      generalSettings: GeneralSettings;
    };
  }

  type Store = State & Action;
}
