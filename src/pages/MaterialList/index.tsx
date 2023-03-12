import {useCallback, useMemo, useRef, useState} from 'react';
import type {FC} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {Appbar, useTheme, IconButton, Searchbar} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GatheringList from '../../components/GatheringList';
import FilterDrawer from '../../components/FilterDrawer';
import type {FilterValue} from '../../components/FilterDrawer';
import type {FilterDrawerInstance} from '../../components/FilterDrawer';
import {gatheringItemsSelector, useStore} from '../../store';
import {useGatheringDataFilter} from '../../hooks/useGatheringDataFilter';
import produce from 'immer';
import {useFocusEffect} from '@react-navigation/native';

const MaterialList: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
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
  useFocusEffect(() => {
    const clearSelectionBackHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (selectedGatheringItems.size > 0) {
          setSelectedGatheringItems(state =>
            produce(state, draft => {
              draft.clear();
            }),
          );
          return true;
        } else {
          return false;
        }
      },
    );
    return () => clearSelectionBackHandler.remove();
  });
  const appHeader = useMemo(
    () => (
      <Appbar.Header>
        <Appbar.Content title="素材列表" />
      </Appbar.Header>
    ),
    [],
  );
  const filterDrawer = useMemo(
    () => (
      <FilterDrawer
        ref={filterDrawerInstance}
        value={filterValue}
        onChange={setFilterValue}
      />
    ),
    [filterValue],
  );
  const searchBar = useMemo(
    () => (
      <View style={styles.searchBarContainer}>
        <Searchbar
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
          }}
          elevation={0}
          placeholder="输入素材名称进行搜索"
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surfaceVariant,
            },
          ]}
          inputStyle={styles.searchBarInput}
        />
        <IconButton
          icon={({color, size}) => (
            <MaterialCommunityIcons
              name="image-filter-none"
              color={color}
              size={size}
            />
          )}
          iconColor={
            effectiveFilterAmount > 0
              ? theme.colors.surfaceVariant
              : theme.colors.primary
          }
          containerColor={
            effectiveFilterAmount > 0
              ? theme.colors.primary
              : theme.colors.surfaceVariant
          }
          mode="contained"
          size={px2DpY(18)}
          style={styles.searchBarFilterButton}
          onPress={() => {
            filterDrawerInstance.current?.show();
          }}
        />
      </View>
    ),
    [
      effectiveFilterAmount,
      searchQuery,
      theme.colors.primary,
      theme.colors.surfaceVariant,
    ],
  );
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}>
      {filterDrawer}
      {appHeader}
      {searchBar}
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
    paddingTop: px2DpY(10),
    paddingBottom: px2DpY(10),
    paddingLeft: px2DpX(16),
    paddingRight: px2DpX(16),
    flexDirection: 'row',
    gap: px2DpX(8),
    width: '100%',
  },
  searchBar: {
    flex: 1,
    height: px2DpY(50),
    borderRadius: px2DpY(25),
  },
  searchBarInput: {
    fontSize: px2DpY(16),
  },
  searchBarFilterButton: {
    height: px2DpY(50),
    width: px2DpY(50),
    margin: 0,
    borderRadius: px2DpY(25),
  },
  gatheringItemListContainer: {
    paddingTop: px2DpY(0),
  },
});

export default MaterialList;
