declare namespace ZustandStore {
  interface Action {
    hideSplashScreen: () => void;
  }

  interface State {
    gatheringItems: AppGlobal.GatheringItem[];
    isSplashScreenShow: boolean;
  }

  type Store = State & Action;
}
