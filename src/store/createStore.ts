import SplashScreen from 'react-native-splash-screen';
import {create} from 'zustand';
import {initialState} from './initialState';

export const useStore = create<ZustandStore.Store>((set, get) => ({
  ...initialState,
  hideSplashScreen: () => {
    if (get().isSplashScreenShow) {
      SplashScreen.hide();
      set({isSplashScreenShow: false});
    }
  },
}));
