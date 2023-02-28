import gatheringItems from '../data/gameData.json';
import regions from '../data/region.json';

export const initialState: ZustandStore.State = {
  gatheringItems,
  regions,
  isSplashScreenShow: true,
  settings: {
    notificationSettings: {
      enableRingtone: true,
      enableVibration: true,
      enableFullScreen: true,
      inAppRingtoneType: 'tts',
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
