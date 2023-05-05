export const gatheringItemsSelector = (s: ZustandStore.Store) =>
  s.gatheringItems;

export const gatheringPointBasesSelector = (s: ZustandStore.Store) =>
  s.gatheringPointBases;

export const reductionItemsSelector = (s: ZustandStore.Store) =>
  s.reductionItems;

export const regionItemsSelector = (s: ZustandStore.Store) => s.regions;

export const craftFilterDataSelector = (s: ZustandStore.Store) =>
  s.craftFilterData;

export const notificationSettingsSelector = (s: ZustandStore.Store) =>
  s.settings.notificationSettings;

export const themeSettingsSelector = (s: ZustandStore.Store) =>
  s.settings.themeSettings;

export const languageSettingsSelector = (s: ZustandStore.Store) =>
  s.settings.languageSettings;

export const generalSettingsSelector = (s: ZustandStore.Store) =>
  s.settings.generalSettings;
