import {View, StyleSheet} from 'react-native';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import type {ForwardRefRenderFunction} from 'react';
import Drawer from '../Drawer';
import DrawerActions from '../DrawerActions';
import DrawerItem from '../DrawerItem';
import RadioTagGroup from '../RadioTagGroup';
import produce from 'immer';
import {px2DpX} from '../../utils/dimensionConverter';
import NumberInput from '../NumberInput';
import RegionSelectorMenu from '../RegionSelectorMenu';

const isRareRadioItems = [
  {
    key: null,
    label: '全部',
  },
  {
    key: true,
    label: '限时',
  },
  {
    key: false,
    label: '非限时',
  },
];

const classJobs = [
  {
    key: null,
    label: '全部',
  },
  {
    key: '采矿工',
    label: '采矿工',
  },
  {
    key: '园艺工',
    label: '园艺工',
  },
];

const exVersions = [
  {
    key: null,
    label: '全部',
  },
  {
    key: 0,
    label: '2.0',
    style: {
      selectedBorderColor: '#909090',
      selectedBackground: '#666',
      unselectedBorderColor: '#909090',
      unselectedBackground: '#666',
    },
  },
  {
    key: 1,
    label: '3.0',
    style: {
      selectedBorderColor: '#90b3fd',
      selectedBackground: '#4C7EE8',
      unselectedBorderColor: '#90b3fd',
      unselectedBackground: '#4C7EE8',
    },
  },
  {
    key: 2,
    label: '4.0',
    style: {
      selectedBorderColor: '#E4667B',
      selectedBackground: '#a22a3e',
      unselectedBorderColor: '#E4667B',
      unselectedBackground: '#a22a3e',
    },
  },
  {
    key: 3,
    label: '5.0',
    style: {
      selectedBorderColor: '#7F11AF',
      selectedBackground: '#2e1d4a',
      unselectedBorderColor: '#7F11AF',
      unselectedBackground: '#2e1d4a',
    },
  },
  {
    key: 4,
    label: '6.0',
    style: {
      selectedBorderColor: '#4296C1',
      selectedBackground: '',
      unselectedBorderColor: '#4296C1',
      unselectedBackground: '',
    },
    linearGradient: {
      colors: ['#3D4E99', '#3584AD', '#CC7A2A'],
    },
  },
];

export type FilterDrawerInstance = {
  show: () => void;
  hide: () => void;
};

const FilterDrawer: ForwardRefRenderFunction<
  FilterDrawerInstance,
  FilterDrawer.Props
> = (props, ref) => {
  const [filterValue, setFilterValue] = useState<FilterDrawer.FilterValue>({
    isRare: null,
    classJob: null,
    exVersion: null,
    gatheringItemLevel: null,
    mapId: null,
  });
  const updateFilterValue = useCallback<
    <T extends keyof FilterDrawer.FilterValue>(
      key: T,
      value: FilterDrawer.FilterValue[T],
    ) => void
  >(
    (key, value) =>
      setFilterValue(state =>
        produce(state, draft => {
          draft[key] = value;
        }),
      ),
    [],
  );
  const [collapsedRegionGroupId, setCollapsedRegionGroupId] = useState(0);
  const [activatedRegionGroupId, setActivatedRegionGroupId] = useState(0);
  const saveFilter = useCallback(() => {}, []);
  const resetFilter = useCallback(() => {
    setFilterValue(state =>
      produce(state, draft => {
        draft.isRare = null;
        draft.classJob = null;
        draft.exVersion = null;
        draft.gatheringItemLevel = null;
        draft.mapId = null;
      }),
    );
    setCollapsedRegionGroupId(0);
  }, []);
  const [visible, setVisible] = useState(false);
  const showDrawer = () => setVisible(true);
  const hideDrawer = useCallback(() => {
    if (activatedRegionGroupId !== collapsedRegionGroupId) {
      setCollapsedRegionGroupId(activatedRegionGroupId);
    }
    setVisible(false);
  }, [activatedRegionGroupId, collapsedRegionGroupId]);
  const drawerFooter = useMemo(
    () => <DrawerActions onCancel={resetFilter} onConfirm={saveFilter} />,
    [resetFilter, saveFilter],
  );
  const isRareRadioGroup = useMemo(
    () => (
      <DrawerItem title="类型">
        <View style={styles.itemContainer}>
          <RadioTagGroup<FilterDrawer.FilterValue['isRare']>
            items={isRareRadioItems}
            value={filterValue.isRare}
            setValue={value => updateFilterValue('isRare', value)}
          />
        </View>
      </DrawerItem>
    ),
    [filterValue.isRare, updateFilterValue],
  );
  const classJobRadioGroup = useMemo(
    () => (
      <DrawerItem title="职业">
        <View style={styles.itemContainer}>
          <RadioTagGroup<FilterDrawer.FilterValue['classJob']>
            items={classJobs}
            value={filterValue.classJob}
            setValue={value => updateFilterValue('classJob', value)}
          />
        </View>
      </DrawerItem>
    ),
    [filterValue.classJob, updateFilterValue],
  );
  const exVersionRadioGroup = useMemo(
    () => (
      <DrawerItem title="版本">
        <View style={styles.itemContainer}>
          <RadioTagGroup<FilterDrawer.FilterValue['exVersion']>
            items={exVersions}
            value={filterValue.exVersion}
            showSelectedIcon
            setValue={value => updateFilterValue('exVersion', value)}
          />
        </View>
      </DrawerItem>
    ),
    [filterValue.exVersion, updateFilterValue],
  );
  const gatheringItemLevelRadioGroup = useMemo(
    () => (
      <DrawerItem title="等级">
        <View style={styles.itemContainer}>
          <NumberInput
            value={filterValue.gatheringItemLevel}
            setValue={value => updateFilterValue('gatheringItemLevel', value)}
            min={5}
            max={90}
            step={5}
            clearable
          />
        </View>
      </DrawerItem>
    ),
    [filterValue.gatheringItemLevel, updateFilterValue],
  );
  const gatheringPointMapRadioGroup = useMemo(
    () => (
      <DrawerItem title="地图">
        <View style={styles.itemContainer}>
          <RegionSelectorMenu
            value={filterValue.mapId}
            onChange={value => updateFilterValue('mapId', value)}
            collapsedGroupId={collapsedRegionGroupId}
            onCollapseGroup={setCollapsedRegionGroupId}
            activatedGroupId={activatedRegionGroupId}
            onActivateGroup={setActivatedRegionGroupId}
          />
        </View>
      </DrawerItem>
    ),
    [
      activatedRegionGroupId,
      collapsedRegionGroupId,
      filterValue.mapId,
      updateFilterValue,
    ],
  );
  useImperativeHandle(ref, () => ({
    show: showDrawer,
    hide: hideDrawer,
  }));
  return (
    <Drawer
      closeOverlayClick
      footer={drawerFooter}
      visible={visible}
      onClose={hideDrawer}>
      <View>
        {isRareRadioGroup}
        {classJobRadioGroup}
      </View>
      <View>
        {exVersionRadioGroup}
        {gatheringItemLevelRadioGroup}
      </View>
      <View>{gatheringPointMapRadioGroup}</View>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    paddingLeft: px2DpX(10),
    width: '100%',
  },
});

export default forwardRef(FilterDrawer);
