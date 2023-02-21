import gatheringItems from '../data/gameData.json';

export const initialState: ZustandStore.State = {
  gatheringItems,
  isSplashScreenShow: true,
  settings: {
    notificationSettings: {
      enableRingtone: true,
      enableVibration: true,
      enableFullScreen: true,
      inAppRingtoneType: 'exVersion',
    },
    themeSettings: {
      themeColor: 'purple',
      darkModeFollowOS: true,
      enableDarkMode: false,
    },
    languageSettings: {
      uiLang: 'zh-cn',
      resLang: 'zh-cn',
    },
    generalSettings: {
      enableEorzeaTimeDisplayer: true,
      enableGatheringItemGesture: true,
      enableFFCafeMapInDetail: false,
      showAllItemsOfGatheringPoint: false,
      enableFFCafeMapInFullScreen: false,
    },
  },
};
