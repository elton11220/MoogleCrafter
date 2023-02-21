import produce from 'immer';
import SplashScreen from 'react-native-splash-screen';
import {create} from 'zustand';
import {initialState} from './initialState';

export const useStore = create<ZustandStore.Store>((set, get) => ({
  ...initialState,
  hideSplashScreen: () => {
    if (get().isSplashScreenShow) {
      SplashScreen.hide();
      set(state =>
        produce(state, draft => {
          draft.isSplashScreenShow = false;
        }),
      );
    }
  },
  updateNotificationSettings: (key, value) =>
    set(state =>
      produce(state, draft => {
        draft.settings.notificationSettings[key] = value;
      }),
    ),
  updateThemeSettings: (key, value) =>
    set(state =>
      produce(state, draft => {
        draft.settings.themeSettings[key] = value;
      }),
    ),
  updateLanguageSettings: (key, value) =>
    set(state =>
      produce(state, draft => {
        draft.settings.languageSettings[key] = value;
      }),
    ),
  updateGeneralSettings: (key, value) =>
    set(state =>
      produce(state, draft => {
        draft.settings.generalSettings[key] = value;
      }),
    ),
}));
