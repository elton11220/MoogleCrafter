import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type {FC} from 'react';
import {
  BackHandler,
  DeviceEventEmitter,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
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
    gatheringItemLevel: null,
    mapId: null,
  });
  const favoriteGatheringItems = useStore(s => s.favoriteGatheringItems);
  const gatheringItems = useMemo(
    () => [...favoriteGatheringItems.values()],
    [favoriteGatheringItems],
  );
  const {removeFavoriteGatheringItem, removeGatheringItemReminder} = useStore(
    s => ({
      removeFavoriteGatheringItem: s.removeFavoriteGatheringItem,
      removeGatheringItemReminder: s.removeGatheringItemReminder,
    }),
  );
  const generalSettings = useStore(generalSettingsSelector);
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
        <MaterialAppHeaderAction
          icon="more-horiz"
          onPress={() => {}}
          hide={!hasSelectedItem}
        />
      </AnimatedBgColorAppBarHeader>
    ),
    [
      clearSelectedGatheringItems,
      generalSettings.enableEorzeaTimeDisplayer,
      hasSelectedItem,
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
        ToastAndroid.show('采集监控服务加载成功', ToastAndroid.SHORT);
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
    const backFromNotificationListener = DeviceEventEmitter.addListener(
      'backFromNotification',
      ({gatheringItemId}) => {
        const gatheringItem = gatheringItemsMap.get(gatheringItemId);
        if (gatheringItem) {
          navigation.navigate('Detail', {
            gatheringItem,
          });
        }
      },
    );
    return () => backFromNotificationListener.remove();
  }, [navigation]);
  useEffect(() => {
    addSubscription(gatheringItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}>
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
});

export default Favorites;
