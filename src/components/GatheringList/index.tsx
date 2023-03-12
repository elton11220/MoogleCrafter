import {FlatList} from 'react-native';
import useEorzeaTimer from '../../hooks/useEorzeaTimer';
import GatheringItem from '../../components/GatheringItem';
import {getTimeTableFromGatheringPoints} from '../../utils/eorzeaTime';
import {px2DpY} from '../../utils/dimensionConverter';
import {memo, useCallback, useRef} from 'react';
import type {FC} from 'react';
import {useNavigation, useScrollToTop} from '@react-navigation/native';

const GatheringList: FC<GatheringList.Props> = props => {
  const {
    data: gatheringItems,
    selectedItems,
    onSelected,
    onCancelSelection,
  } = props;
  const eorzeaTime = useEorzeaTimer();
  const navigation = useNavigation();
  const flatListRef = useRef<FlatList<AppGlobal.GatheringItem> | null>(null);
  useScrollToTop(flatListRef);
  const onIconPressed = useCallback(
    (item: AppGlobal.GatheringItem) => {
      if (selectedItems.has(item.id)) {
        onCancelSelection(item.id);
      } else {
        onSelected(item);
      }
    },
    [onCancelSelection, onSelected, selectedItems],
  );
  const onItemPressed = useCallback(
    (item: AppGlobal.GatheringItem) => {
      if (selectedItems.size > 0) {
        onIconPressed(item);
      } else {
        navigation.navigate('Detail', {
          gatheringItem: item,
        });
      }
    },
    [navigation, onIconPressed, selectedItems.size],
  );
  const renderItem: (info: {item: AppGlobal.GatheringItem}) => JSX.Element = ({
    item,
  }) => (
    <GatheringItem
      gatheringItem={item}
      eorzeaTime={eorzeaTime}
      timeTable={getTimeTableFromGatheringPoints(item.gatheringPoints)}
      onPressed={onItemPressed}
      onLongPressed={onSelected}
      onIconPressed={onIconPressed}
      selected={selectedItems.has(item.id)}
    />
  );
  const getItemLayout = useCallback(
    (data: AppGlobal.GatheringItem[] | null | undefined, index: number) => ({
      length: px2DpY(80),
      offset: px2DpY(80) * index,
      index,
    }),
    [],
  );
  const keyExtractor = useCallback(
    (item: AppGlobal.GatheringItem) => `${item.id}-${item.name}`,
    [],
  );
  return (
    <FlatList
      ref={flatListRef}
      data={gatheringItems}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      keyExtractor={keyExtractor}
      windowSize={2}
      initialNumToRender={7}
    />
  );
};

export default memo(GatheringList);
