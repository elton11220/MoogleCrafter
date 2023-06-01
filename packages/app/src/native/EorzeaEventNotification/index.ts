import {NativeModules} from 'react-native';

export function addSubscription(gatheringItems: AppGlobal.GatheringItem[]) {
  NativeModules.EorzeaEventNotification.addSubscription(
    JSON.stringify(gatheringItems),
  );
}

export function removeSubscription(gatheringItems: AppGlobal.GatheringItem[]) {
  NativeModules.EorzeaEventNotification.removeSubscription(
    JSON.stringify(gatheringItems),
  );
}

export const bindService = NativeModules.EorzeaEventNotification.bindService;
