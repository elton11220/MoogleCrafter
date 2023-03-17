import gatheringItems from '../data/gatheringData.json';
import gatheringPointBases from '../data/gatheringPointBase.json';
import regions from '../data/region.json';

export const initialState: ZustandStore.State = {
  gatheringItems,
  gatheringPointBases,
  favoriteGatheringItems: new Map(),
  favoriteGatheringItemIds: new Set(),
  remindedGatheringItemIds: new Set(),
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
      enableFFCafeMapInDetail: true,
      showAllItemsOfGatheringPoint: true,
      enableFFCafeMapInFullScreen: true,
    },
  },
};
