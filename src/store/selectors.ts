export const gatheringItemsSelector = (s: ZustandStore.Store) =>
  s.gatheringItems;

export const notificationSettingsSelector = (s: ZustandStore.Store) =>
  s.settings.notificationSettings;

export const themeSettingsSelector = (s: ZustandStore.Store) =>
  s.settings.themeSettings;

export const languageSettingsSelector = (s: ZustandStore.Store) =>
  s.settings.languageSettings;

export const generalSettingsSelector = (s: ZustandStore.Store) =>
  s.settings.generalSettings;
