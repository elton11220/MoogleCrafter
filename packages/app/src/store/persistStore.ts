import {MMKV} from 'react-native-mmkv';
import {initializeMMKVFlipper} from 'react-native-mmkv-flipper-plugin';
import type {PersistStorage} from 'zustand/middleware';
import gatheringItems from '../data/gatheringData.json';

const storage = new MMKV();

export const gatheringItemsMap = new Map(
  Array.from(gatheringItems.map(item => [item.id, item])),
);

if (__DEV__) {
  initializeMMKVFlipper({default: storage});
}

export const zustandPersistStorage: PersistStorage<ZustandStore.PersistedState> =
  {
    getItem: name => {
      const value = storage.getString(name);
      const parsedValue = value ? JSON.parse(value) : null;
      const favoriteGatheringItems = new Map();
      if (parsedValue) {
        parsedValue.state.favoriteGatheringItems.forEach((item: number) => {
          if (gatheringItemsMap.has(item)) {
            favoriteGatheringItems.set(item, gatheringItemsMap.get(item));
          }
        });
      }
      return parsedValue
        ? {
            state: {
              ...parsedValue.state,
              favoriteGatheringItems,
              favoriteGatheringItemIds: new Set(
                parsedValue.state.favoriteGatheringItemIds,
              ),
              remindedGatheringItemIds: new Set(
                parsedValue.state.remindedGatheringItemIds,
              ),
            },
            version: parsedValue.version,
          }
        : null;
    },
    setItem: (name, value) =>
      storage.set(
        name,
        JSON.stringify({
          state: {
            ...value.state,
            favoriteGatheringItems: Array.from(
              value.state.favoriteGatheringItems.keys(),
            ),
            favoriteGatheringItemIds: [...value.state.favoriteGatheringItemIds],
            remindedGatheringItemIds: [...value.state.remindedGatheringItemIds],
          },
          version: value.version,
        }),
      ),
    removeItem: name => storage.delete(name),
  };

export const zustandPersistPartialize: (
  s: ZustandStore.Store,
) => ZustandStore.PersistedState = state => ({
  favoriteGatheringItems: state.favoriteGatheringItems,
  favoriteGatheringItemIds: state.favoriteGatheringItemIds,
  remindedGatheringItemIds: state.remindedGatheringItemIds,
  settings: state.settings,
  readAnnouncementId: state.readAnnouncementId,
  showCheckPermissionWhenLaunch: state.showCheckPermissionWhenLaunch,
  acceptUserAgreement: state.acceptUserAgreement,
  acceptPrivacyPolicy: state.acceptPrivacyPolicy,
});
