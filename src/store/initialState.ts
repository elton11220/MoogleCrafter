import gatheringItems from '../data/gatheringData.json';
import gatheringPointBases from '../data/gatheringPointBase.json';
import reductionItems from '../data/reductionData.json';
import regions from '../data/region.json';

export const initialState: ZustandStore.State = {
  gatheringItems,
  gatheringPointBases,
  reductionItems,
  favoriteGatheringItems: new Map(),
  favoriteGatheringItemIds: new Set(),
  remindedGatheringItemIds: new Set(),
  regions,
  isSplashScreenShow: true,
  settings: {
    notificationSettings: {
      enableSpecialRingtone: true,
      enableFullScreen: false,
      specialRingtoneType: 'simple',
    },
    themeSettings: {
      themeColor: 'blue',
      darkModeFollowOS: true,
      enableDarkMode: false,
    },
    languageSettings: {
      uiLang: 'zh-cn',
      resLang: 'zh-cn',
    },
    generalSettings: {
      enableEorzeaTimeDisplayer: true,
      placeNameDispMode: 'a',
      enableFFCafeMapInDetail: true,
      showAllItemsOfGatheringPoint: true,
      enableFFCafeMapInFullScreen: true,
    },
  },
  readAnnouncementId: '',
  showCheckPermissionWhenLaunch: true,
  acceptUserAgreement: false,
  acceptPrivacyPolicy: false,
};
