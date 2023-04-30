import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

export type RootStackParamList = {
  HomeTabs: NavigatorScreenParams<HomeTabParamList>;
  NotificationSettings: undefined;
  ThemeSettings: undefined;
  LanguageSettings: undefined;
  GeneralSettings: undefined;
  About: undefined;
  Detail: {
    gatheringItem: AppGlobal.GatheringItem;
  };
  FullScreenReminder: {
    gatheringItem: AppGlobal.GatheringItem;
  };
  CheckPermission: {
    preventBack: boolean;
    showDismissButton: boolean;
  };
  ReductionDetail: AppGlobal.ReductionItem;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type HomeTabParamList = {
  Favorites: undefined;
  MaterialList: undefined;
  Settings: undefined;
};

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
