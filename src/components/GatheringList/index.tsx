import {FlatList} from 'react-native';
import useEorzeaTimer from '../../hooks/useEorzeaTimer';
import GatheringItem from '../../components/GatheringItem';
import {getTimeTableFromGatheringPoints} from '../../utils/eorzeaTime';
import {px2DpY} from '../../utils/dimensionConverter';
import {memo, useCallback, useRef} from 'react';
import type {FC} from 'react';
import {useScrollToTop} from '@react-navigation/native';

const GatheringList: FC<GatheringList.Props> = props => {
  const {data: gatheringItems} = props;
  const eorzeaTime = useEorzeaTimer();
  const flatListRef = useRef<FlatList<AppGlobal.GatheringItem> | null>(null);
  useScrollToTop(flatListRef);
  const renderItem: (info: {item: AppGlobal.GatheringItem}) => JSX.Element = ({
    item,
  }) => (
    <GatheringItem
      gatheringItem={item}
      eorzeaTime={eorzeaTime}
      timeTable={getTimeTableFromGatheringPoints(item.gatheringPoints)}
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
