import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {FC} from 'react';
import {
  BackHandler,
  DeviceEventEmitter,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {Text, useTheme, Menu} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import GatheringList from '../../components/GatheringList';
import FilterDrawer from '../../components/FilterDrawer';
import type {FilterValue} from '../../components/FilterDrawer';
import type {FilterDrawerInstance} from '../../components/FilterDrawer';
import {
  generalSettingsSelector,
  notificationSettingsSelector,
  useStore,
} from '../../store';
import {useGatheringDataFilter} from '../../hooks/useGatheringDataFilter';
import produce from 'immer';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import AnimatedBgColorAppBarHeader from '../../components/AnimatedBgColorAppBarHeader';
import AnimatedBackgroundColorView from '../../components/AnimatedBackgroundColorView';
import AnimatedBgColorSearchBar from '../../components/AnimatedBgColorSearchBar';
import AnimatedBgColorFilterButton from '../../components/AnimatedBgColorFilterButton';
import SplashScreen from 'react-native-splash-screen';
import MaterialAppHeaderBackAction from '../../components/MaterialAppHeaderBackAction';
import MaterialAppHeaderAction from '../../components/MaterialAppHeaderAction';
import EorzeaTimeDisplayer from '../../components/EorzeaTimeDisplayer';
import {
  addSubscription,
  bindService,
} from '../../native/EorzeaEventNotification';
import {gatheringItemsMap} from '../../store/persistStore';
import {
  NotificationMode,
  setNotificationMode,
} from '../../native/SpecialRingtone';
import UpdateDialog from '../../components/UpdateDialog';
import {useUpdateDialog} from '../../components/UpdateDialog/useUpdateDialog';
import AnnouncementDialog from '../../components/AnnouncementDialog';
import ConfirmDialog, {
  ConfirmDialogInstance,
} from '../../components/ConfirmDialog';
import {privacyPolicy, userAgreement} from '../../config/strings';
import {
  initStatService,
  initStatServiceInBrowseMode,
  onPageEnd,
  onPageStart,
} from '../../native/BaiduMobStat';

const Favorites: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const [searchQuery, setSearchQuery] = useState('');
  const filterDrawerInstance = useRef<FilterDrawerInstance | null>(null);
  const navigation = useNavigation();
  const [filterValue, setFilterValue] = useState<FilterValue>({
    isRare: null,
    classJob: null,
    exVersion: null,
    specialType: null,
    gatheringItemLevel: null,
    mapId: null,
  });
  const favoriteGatheringItems = useStore(s => s.favoriteGatheringItems);
  const remindedGatheringItemIds = useStore(s => s.remindedGatheringItemIds);
  const gatheringItems = useMemo(
    () => [...favoriteGatheringItems.values()],
    [favoriteGatheringItems],
  );
  const {
    removeFavoriteGatheringItem,
    removeGatheringItemReminder,
    addFavoriteGatheringItem,
    addGatheringItemReminder,
  } = useStore(s => ({
    removeFavoriteGatheringItem: s.removeFavoriteGatheringItem,
    removeGatheringItemReminder: s.removeGatheringItemReminder,
    addFavoriteGatheringItem: s.addFavoriteGatheringItem,
    addGatheringItemReminder: s.addGatheringItemReminder,
  }));
  const generalSettings = useStore(generalSettingsSelector);
  const showCheckPermissionWhenLaunch = useStore(
    s => s.showCheckPermissionWhenLaunch,
  );
  const [, filteredGatheringItems, effectiveFilterAmount] =
    useGatheringDataFilter(gatheringItems, filterValue, searchQuery);
  const [selectedGatheringItems, setSelectedGatheringItems] = useState<
    Map<AppGlobal.GatheringItem['id'], AppGlobal.GatheringItem>
  >(new Map());
  const onGatheringItemSelected = useCallback(
    (item: AppGlobal.GatheringItem) => {
      setSelectedGatheringItems(state =>
        produce(state, draft => {
          draft.set(item.id, item);
        }),
      );
    },
    [],
  );
  const onGatheringItemCancelSelection = useCallback(
    (itemId: AppGlobal.GatheringItem['id']) => {
      setSelectedGatheringItems(state =>
        produce(state, draft => {
          draft.delete(itemId);
        }),
      );
    },
    [],
  );
  const clearSelectedGatheringItems = useCallback(() => {
    setSelectedGatheringItems(state =>
      produce(state, draft => {
        draft.clear();
      }),
    );
  }, []);
  const hasSelectedItem = useMemo(
    () => selectedGatheringItems.size > 0,
    [selectedGatheringItems.size],
  );
  useFocusEffect(() => {
    const clearUserEffectBackHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        let effectiveFlag = false;
        if (hasSelectedItem) {
          effectiveFlag = true;
          setSelectedGatheringItems(state =>
            produce(state, draft => {
              draft.clear();
            }),
          );
        } else if (searchQuery.length > 0) {
          effectiveFlag = true;
          setSearchQuery('');
        }
        return effectiveFlag;
      },
    );
    return () => clearUserEffectBackHandler.remove();
  });
  const onFilterButtonPress = useCallback(
    () => filterDrawerInstance.current?.show(),
    [],
  );
  const onRemoveRemItemActionTriggered = useCallback(() => {
    removeGatheringItemReminder(selectedGatheringItems);
    setSelectedGatheringItems(state =>
      produce(state, draft => {
        draft.clear();
      }),
    );
  }, [removeGatheringItemReminder, selectedGatheringItems]);
  const onRemoveFavItemActionTriggered = useCallback(() => {
    removeFavoriteGatheringItem(selectedGatheringItems);
    setSelectedGatheringItems(state =>
      produce(state, draft => {
        draft.clear();
      }),
    );
  }, [removeFavoriteGatheringItem, selectedGatheringItems]);
  const [isMultiSelectMenuOpen, setMultiSelectMenuOpen] = useState(false);
  const onAddRemItemActionTriggered = useCallback(() => {
    addGatheringItemReminder(selectedGatheringItems);
    setMultiSelectMenuOpen(false);
    setSelectedGatheringItems(state =>
      produce(state, draft => {
        draft.clear();
      }),
    );
  }, [addGatheringItemReminder, selectedGatheringItems]);
  const onAddFavItemActionTriggered = useCallback(() => {
    addFavoriteGatheringItem(selectedGatheringItems);
    setMultiSelectMenuOpen(false);
    setSelectedGatheringItems(state =>
      produce(state, draft => {
        draft.clear();
      }),
    );
  }, [addFavoriteGatheringItem, selectedGatheringItems]);
  const appHeader = useMemo(
    () => (
      <AnimatedBgColorAppBarHeader
        activated={hasSelectedItem}
        style={{
          paddingLeft: hasSelectedItem ? undefined : 16,
        }}>
        <MaterialAppHeaderBackAction
          onPress={clearSelectedGatheringItems}
          hide={!hasSelectedItem}
        />
        <Text
          style={[
            styles.appBarHeaderTitle,
            {flex: hasSelectedItem ? 1 : undefined},
          ]}
          allowFontScaling={false}>
          {hasSelectedItem
            ? `已选择 ${selectedGatheringItems.size}`
            : '我的收藏'}
        </Text>
        {!generalSettings.enableEorzeaTimeDisplayer ||
        hasSelectedItem ? null : (
          <EorzeaTimeDisplayer />
        )}
        <MaterialAppHeaderAction
          icon="notification-off"
          onPress={onRemoveRemItemActionTriggered}
          hide={!hasSelectedItem}
          useIconFont
        />
        <MaterialAppHeaderAction
          icon="dislike-line"
          onPress={onRemoveFavItemActionTriggered}
          hide={!hasSelectedItem}
          useIconFont
        />
        <Menu
          visible={isMultiSelectMenuOpen}
          anchorPosition="bottom"
          onDismiss={() => setMultiSelectMenuOpen(false)}
          anchor={
            <MaterialAppHeaderAction
              icon="more-horiz"
              onPress={() => setMultiSelectMenuOpen(true)}
              hide={!hasSelectedItem}
            />
          }>
          <Menu.Item
            title="添加收藏"
            titleStyle={styles.menuItemTitle}
            style={styles.menuItemContainer}
            onPress={onAddFavItemActionTriggered}
          />
          <Menu.Item
            title="添加提醒"
            titleStyle={styles.menuItemTitle}
            style={styles.menuItemContainer}
            onPress={onAddRemItemActionTriggered}
          />
        </Menu>
      </AnimatedBgColorAppBarHeader>
    ),
    [
      clearSelectedGatheringItems,
      generalSettings.enableEorzeaTimeDisplayer,
      hasSelectedItem,
      isMultiSelectMenuOpen,
      onAddFavItemActionTriggered,
      onAddRemItemActionTriggered,
      onRemoveFavItemActionTriggered,
      onRemoveRemItemActionTriggered,
      selectedGatheringItems.size,
    ],
  );
  const onFilterDrawerChange = useCallback(
    (action: FilterValue | ((value: FilterValue) => FilterValue)) => {
      setFilterValue(action);
      setSelectedGatheringItems(state =>
        state.size > 0
          ? produce(state, draft => {
              draft.clear();
            })
          : state,
      );
    },
    [],
  );
  const filterDrawer = useMemo(
    () => (
      <FilterDrawer
        ref={filterDrawerInstance}
        value={filterValue}
        onChange={onFilterDrawerChange}
      />
    ),
    [filterValue, onFilterDrawerChange],
  );
  const onChangeSearchBarText = useCallback((value: string) => {
    setSearchQuery(value);
    setSelectedGatheringItems(state =>
      state.size > 0
        ? produce(state, draft => {
            draft.clear();
          })
        : state,
    );
  }, []);
  const notificationSettings = useStore(notificationSettingsSelector);
  useEffect(() => {
    const onEorzeaEventNotificationServiceBound =
      DeviceEventEmitter.addListener('onENServiceBound', () => {
        SplashScreen.hide();
      });
    const onEorzeaEventNotificationServiceUnbound =
      DeviceEventEmitter.addListener('onENServiceUnbound', () => {
        ToastAndroid.show('采集监控服务异常，请重启App', ToastAndroid.LONG);
      });
    bindService();
    if (notificationSettings.enableSpecialRingtone) {
      if (notificationSettings.specialRingtoneType === 'simple') {
        setNotificationMode(NotificationMode.SIMPLE);
      } else if (notificationSettings.specialRingtoneType === 'tts') {
        setNotificationMode(NotificationMode.TTS);
      } else if (notificationSettings.specialRingtoneType === 'exVersion') {
        setNotificationMode(NotificationMode.EORZEA_THEME);
      }
    }
    return () => {
      onEorzeaEventNotificationServiceBound.remove();
      onEorzeaEventNotificationServiceUnbound.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const gatheringEventListener = DeviceEventEmitter.addListener(
      'gatheringEventTriggered',
      (data: AppGlobal.GatheringItem['id'][]) => {
        if (data.length > 0 && notificationSettings.enableFullScreen) {
          const gatheringItem = gatheringItemsMap.get(data[0]);
          if (gatheringItem) {
            navigation.navigate('FullScreenReminder', {
              gatheringItem,
            });
          }
        }
      },
    );
    return () => gatheringEventListener.remove();
  }, [navigation, notificationSettings.enableFullScreen]);
  useEffect(() => {
    const remindedGatheringItems: AppGlobal.GatheringItem[] = [];
    for (const entry of favoriteGatheringItems.entries()) {
      if (remindedGatheringItemIds.has(entry[0])) {
        remindedGatheringItems.push(entry[1]);
      }
    }
    addSubscription(remindedGatheringItems);
    if (
      acceptPrivacyPolicy &&
      acceptUserAgreement &&
      showCheckPermissionWhenLaunch
    ) {
      navigation.navigate('CheckPermission', {
        preventBack: true,
        showDismissButton: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    visible: updateDialogVisible,
    onDismiss: onUpdateDialogDismiss,
    onConfirm: onUpdateDialogConfirm,
    currentUpdateInfo,
  } = useUpdateDialog({checkWhenMount: true});
  const {
    acceptUserAgreement,
    acceptPrivacyPolicy,
    updateAcceptUserAgreement,
    updateAcceptPrivacyPolicy,
  } = useStore(s => ({
    acceptUserAgreement: s.acceptUserAgreement,
    acceptPrivacyPolicy: s.acceptPrivacyPolicy,
    updateAcceptUserAgreement: s.updateAcceptUserAgreement,
    updateAcceptPrivacyPolicy: s.updateAcceptPrivacyPolicy,
  }));
  const privacyPolicyDialogInstance = useRef<ConfirmDialogInstance | null>(
    null,
  );
  const userAgreementDialogInstance = useRef<ConfirmDialogInstance | null>(
    null,
  );
  const onPrivacyPolicyDialogConfirm = useCallback(() => {
    initStatService();
    updateAcceptPrivacyPolicy(true);
    if (privacyPolicyDialogInstance.current !== null) {
      privacyPolicyDialogInstance.current.hide();
    }
  }, [updateAcceptPrivacyPolicy]);
  const onPrivacyPolicyDialogCancel = useCallback(() => {
    initStatServiceInBrowseMode();
    if (privacyPolicyDialogInstance.current !== null) {
      privacyPolicyDialogInstance.current.hide();
    }
  }, []);
  const onPrivacyPolicyDialogClosed = useCallback(() => {
    if (!acceptUserAgreement && userAgreementDialogInstance.current !== null) {
      userAgreementDialogInstance.current.show();
    }
  }, [acceptUserAgreement]);
  const onUserAgreementDialogConfirm = useCallback(() => {
    updateAcceptUserAgreement(true);
    if (userAgreementDialogInstance.current !== null) {
      userAgreementDialogInstance.current.hide();
    }
  }, [updateAcceptUserAgreement]);
  const onUserAgreementDialogCancel = useCallback(() => {
    if (userAgreementDialogInstance.current !== null) {
      userAgreementDialogInstance.current.hide();
    }
  }, []);
  const onUserAgreementDialogClosed = useCallback(() => {
    if (showCheckPermissionWhenLaunch) {
      navigation.navigate('CheckPermission', {
        preventBack: true,
        showDismissButton: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!acceptPrivacyPolicy && privacyPolicyDialogInstance.current !== null) {
      privacyPolicyDialogInstance.current.show();
    } else if (
      !acceptUserAgreement &&
      userAgreementDialogInstance.current !== null
    ) {
      userAgreementDialogInstance.current.show();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onPageFocusChanged = useCallback(() => {
    onPageStart('Favorites');
    return () => {
      onPageEnd('Favorites');
    };
  }, []);
  useFocusEffect(onPageFocusChanged);
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}>
      <ConfirmDialog
        ref={privacyPolicyDialogInstance}
        title="隐私政策"
        content={privacyPolicy}
        confirmText="同意"
        cancelText="不同意"
        onConfirm={onPrivacyPolicyDialogConfirm}
        onCancel={onPrivacyPolicyDialogCancel}
        onClosed={onPrivacyPolicyDialogClosed}
      />
      <ConfirmDialog
        ref={userAgreementDialogInstance}
        title="用户协议"
        content={userAgreement}
        confirmText="同意"
        cancelText="不同意"
        onConfirm={onUserAgreementDialogConfirm}
        onCancel={onUserAgreementDialogCancel}
        onClosed={onUserAgreementDialogClosed}
      />
      <AnnouncementDialog
        canRequest={acceptPrivacyPolicy && acceptUserAgreement}
      />
      <UpdateDialog
        visible={updateDialogVisible}
        onDismiss={onUpdateDialogDismiss}
        onConfirm={onUpdateDialogConfirm}
        allowSkip={!currentUpdateInfo.isForce}
        rightText={currentUpdateInfo.version}
        content={currentUpdateInfo.content}
      />
      {filterDrawer}
      {appHeader}
      <AnimatedBackgroundColorView
        initialColor={theme.colors.background}
        activeColor={theme.colors.surfaceVariant}
        activated={hasSelectedItem}
        style={styles.searchBarContainer}>
        <AnimatedBgColorSearchBar
          activated={hasSelectedItem}
          value={searchQuery}
          onChangeText={onChangeSearchBarText}
          placeholder="输入素材名称进行搜索"
        />
        <AnimatedBgColorFilterButton
          activated={effectiveFilterAmount > 0}
          activatedBg={hasSelectedItem}
          onPress={onFilterButtonPress}
        />
      </AnimatedBackgroundColorView>
      {/* <View style={styles.topItemContainer}>
        <View style={styles.topItemIndicatorContainer}>
          <Text
            allowFontScaling={false}
            style={[
              styles.topItemIndicatorTitle,
              {
                color: theme.colors.primary,
              },
            ]}>
            置顶素材
          </Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={px2DpY(20)}
            color={theme.colors.secondaryContentText}
          />
        </View>
      </View> */}
      <GatheringList
        data={filteredGatheringItems}
        onSelected={onGatheringItemSelected}
        selectedItems={selectedGatheringItems}
        onCancelSelection={onGatheringItemCancelSelection}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingTop: px2DpY(5),
    paddingBottom: px2DpY(10),
    paddingLeft: px2DpX(16),
    paddingRight: px2DpX(16),
    flexDirection: 'row',
    gap: px2DpX(8),
    width: '100%',
  },
  appBarHeaderTitle: {
    fontSize: px2DpY(22),
    lineHeight: px2DpY(28),
  },
  topItemContainer: {
    paddingLeft: px2DpX(16),
    paddingRight: px2DpX(16),
  },
  topItemIndicatorContainer: {
    paddingTop: px2DpY(18),
    paddingBottom: px2DpY(5),
    paddingLeft: px2DpX(8),
    paddingRight: px2DpX(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topItemIndicatorTitle: {
    fontSize: px2DpY(14),
  },
  topItemScrollView: {
    width: '100%',
  },
  menuItemTitle: {
    fontSize: px2DpY(16),
  },
  menuItemContainer: {
    height: px2DpY(50),
  },
});

export default Favorites;
