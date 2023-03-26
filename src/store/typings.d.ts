declare namespace ZustandStore {
  type InAppRingtoneType = 'simple' | 'tts' | 'exVersion';

  interface NotificationSettings {
    enableRingtone: boolean;
    enableVibration: boolean;
    enableFullScreen: boolean;
    inAppRingtoneType: InAppRingtoneType;
  }

  type ThemeKey = 'purple' | 'blue' | 'pink' | 'green' | 'yellow' | 'cyan';

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
    addFavoriteGatheringItem: (
      items: Map<AppGlobal.GatheringItem['id'], AppGlobal.GatheringItem>,
    ) => void;
    addGatheringItemReminder: (
      items: Map<AppGlobal.GatheringItem['id'], AppGlobal.GatheringItem>,
    ) => void;
    removeFavoriteGatheringItem: (
      items: Map<AppGlobal.GatheringItem['id'], AppGlobal.GatheringItem>,
    ) => void;
    removeGatheringItemReminder: (
      items: Map<AppGlobal.GatheringItem['id'], AppGlobal.GatheringItem>,
    ) => void;
  }

  interface State {
    gatheringItems: AppGlobal.GatheringItem[];
    gatheringPointBases: AppGlobal.GatheringPointBase[];
    favoriteGatheringItems: Map<
      AppGlobal.GatheringItem['id'],
      AppGlobal.GatheringItem
    >;
    favoriteGatheringItemIds: Set<AppGlobal.GatheringItem['id']>;
    remindedGatheringItemIds: Set<AppGlobal.GatheringItem['id']>;
    regions: AppGlobal.RegionItem[];
    isSplashScreenShow: boolean;
    settings: {
      notificationSettings: NotificationSettings;
      themeSettings: ThemeSettings;
      languageSettings: LanguageSettings;
      generalSettings: GeneralSettings;
    };
  }

  type PersistedState = Pick<
    State,
    | 'favoriteGatheringItems'
    | 'favoriteGatheringItemIds'
    | 'remindedGatheringItemIds'
    | 'settings'
  >;

  type Store = State & Action;
}
