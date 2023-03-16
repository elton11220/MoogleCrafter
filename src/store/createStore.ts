import produce from 'immer';
import SplashScreen from 'react-native-splash-screen';
import {create} from 'zustand';
import {computed} from 'zustand-computed';
import {initialState} from './initialState';

export const useStore = create<
  ZustandStore.Store,
  [['chrisvander/zustand-computed', ZustandStore.ComputedState]]
>(
  computed(
    (set, get) => ({
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
      addFavoriteGatheringItem: items => {
        set(state =>
          produce(state, draft => {
            items.forEach((value, key) => {
              if (!get().favoriteGatheringItemIds.has(key)) {
                draft.favoriteGatheringItemIds.add(key);
              }
              if (!get().favoriteGatheringItems.has(key)) {
                draft.favoriteGatheringItems.set(key, value);
              }
            });
          }),
        );
      },
      addGatheringItemReminder: items => {
        set(state =>
          produce(state, draft => {
            items.forEach((value, key) => {
              if (!get().remindedGatheringItemIds.has(key)) {
                draft.remindedGatheringItemIds.add(key);
              }
              if (!get().favoriteGatheringItems.has(key)) {
                draft.favoriteGatheringItems.set(key, value);
              }
            });
          }),
        );
      },
      removeFavoriteGatheringItem: items => {
        set(state =>
          produce(state, draft => {
            items.forEach((_, key) => {
              if (get().favoriteGatheringItemIds.has(key)) {
                draft.favoriteGatheringItemIds.delete(key);
              }
              if (
                !get().remindedGatheringItemIds.has(key) &&
                get().favoriteGatheringItems.has(key)
              ) {
                draft.favoriteGatheringItems.delete(key);
              }
            });
          }),
        );
      },
      removeGatheringItemReminder: items => {
        set(state =>
          produce(state, draft => {
            items.forEach((_, key) => {
              if (get().remindedGatheringItemIds.has(key)) {
                draft.remindedGatheringItemIds.delete(key);
              }
              if (
                !get().favoriteGatheringItemIds.has(key) &&
                get().favoriteGatheringItems.has(key)
              ) {
                draft.favoriteGatheringItems.delete(key);
              }
            });
          }),
        );
      },
    }),
    state => ({
      favoriteGatheringItemsArray: [...state.favoriteGatheringItems.values()],
    }),
  ),
);
