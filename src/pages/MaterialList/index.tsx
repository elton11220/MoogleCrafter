import {useCallback, useMemo, useRef, useState} from 'react';
import type {FC} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import GatheringList from '../../components/GatheringList';
import FilterDrawer from '../../components/FilterDrawer';
import type {FilterValue} from '../../components/FilterDrawer';
import type {FilterDrawerInstance} from '../../components/FilterDrawer';
import {
  gatheringItemsSelector,
  generalSettingsSelector,
  useStore,
} from '../../store';
import {useGatheringDataFilter} from '../../hooks/useGatheringDataFilter';
import produce from 'immer';
import {useFocusEffect} from '@react-navigation/native';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import AnimatedBgColorAppBarHeader from '../../components/AnimatedBgColorAppBarHeader';
import AnimatedBackgroundColorView from '../../components/AnimatedBackgroundColorView';
import AnimatedBgColorSearchBar from '../../components/AnimatedBgColorSearchBar';
import AnimatedBgColorFilterButton from '../../components/AnimatedBgColorFilterButton';
import MaterialAppHeaderAction from '../../components/MaterialAppHeaderAction';
import MaterialAppHeaderBackAction from '../../components/MaterialAppHeaderBackAction';
import EorzeaTimeDisplayer from '../../components/EorzeaTimeDisplayer';

const MaterialList: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const [searchQuery, setSearchQuery] = useState('');
  const filterDrawerInstance = useRef<FilterDrawerInstance | null>(null);
  const [filterValue, setFilterValue] = useState<FilterValue>({
    isRare: null,
    classJob: null,
    exVersion: null,
    gatheringItemLevel: null,
    mapId: null,
  });
  const gatheringItems = useStore(gatheringItemsSelector);
  const {addFavoriteGatheringItem, addGatheringItemReminder} = useStore(s => ({
    addFavoriteGatheringItem: s.addFavoriteGatheringItem,
    addGatheringItemReminder: s.addGatheringItemReminder,
  }));
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
  const onAddRemItemActionTriggered = useCallback(() => {
    addGatheringItemReminder(selectedGatheringItems);
    setSelectedGatheringItems(state =>
      produce(state, draft => {
        draft.clear();
      }),
    );
  }, [addGatheringItemReminder, selectedGatheringItems]);
  const onAddFavItemActionTriggered = useCallback(() => {
    addFavoriteGatheringItem(selectedGatheringItems);
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
            : '素材列表'}
        </Text>
        {!generalSettings.enableEorzeaTimeDisplayer ||
        hasSelectedItem ? null : (
          <EorzeaTimeDisplayer />
        )}
        <MaterialAppHeaderAction
          icon="notifications-none"
          onPress={onAddRemItemActionTriggered}
          hide={!hasSelectedItem}
        />
        <MaterialAppHeaderAction
          icon="favorite-border"
          onPress={onAddFavItemActionTriggered}
          hide={!hasSelectedItem}
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
      onAddFavItemActionTriggered,
      onAddRemItemActionTriggered,
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
});

export default MaterialList;
