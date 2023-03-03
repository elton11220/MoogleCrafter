import React, {FC, memo, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text, useTheme} from 'react-native-paper';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {itemIcons} from '../../images/gameResource';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {
  GatheringRarePopEventState,
  getCountdownValueByParsedEvents,
  getPoppingEvent,
  getPoppingGatheringPointByParsedEvents,
  parseGatheringRarePopEvents,
} from '../../utils/eorzeaTime';
import GatheringItemTimerGroup from '../GatheringItemTimerGroup';

const GatheringItem: FC<GatheringItem.Props> = props => {
  const {timeTable, gatheringItem, eorzeaTime} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const parsedGatheringRarePopEvents = parseGatheringRarePopEvents(
    timeTable,
    eorzeaTime.currentEt,
  );
  const eventInfo = useMemo(() => {
    const poppingEvent = getPoppingEvent(parsedGatheringRarePopEvents);
    if (poppingEvent !== null) {
      return {
        startTimeLt: poppingEvent.startTimeLt.format('HH:mm'),
        startTimeEt: poppingEvent.startTimeEt.format('HH:mm'),
        state: poppingEvent.state,
      };
    } else {
      return {
        startTimeLt: '--',
        startTimeEt: '--',
        state: null,
      };
    }
  }, [parsedGatheringRarePopEvents]);
  const gatheringPointDetail = getPoppingGatheringPointByParsedEvents(
    gatheringItem.gatheringPoints,
    parsedGatheringRarePopEvents,
  );
  return (
    <View style={styles.container}>
      <FastImage
        style={styles.itemIcon}
        source={itemIcons.get(gatheringItem.icon.toString())}
        resizeMode={FastImage.resizeMode.stretch}
      />
      <View style={styles.contentContainer}>
        <View style={styles.contentTitleRow}>
          <Text
            style={[
              styles.itemName,
              {
                color: theme.colors.primaryContentText,
              },
            ]}
            allowFontScaling={false}>
            {gatheringItem.name}
          </Text>
        </View>
        <View>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={[
              styles.itemDescRow,
              {
                color: theme.colors.secondaryContentText,
              },
            ]}>
            {`等级${gatheringItem.gatheringItemLevel} ${
              gatheringPointDetail.classJob ?? '-'
            }`}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={[
              styles.itemDescRow,
              {
                color: theme.colors.secondaryContentText,
              },
            ]}>
            {`${gatheringPointDetail?.placeName ?? '-'} X: ${
              gatheringPointDetail?.x ?? '-'
            }, Y: ${gatheringPointDetail?.y ?? '-'}`}
          </Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <GatheringItemTimerGroup
          startTimeLt={eventInfo.startTimeLt}
          startTimeEt={eventInfo.startTimeEt}
          countdownActivate={
            eventInfo.state === GatheringRarePopEventState.OCCURRING
          }
          countdownValue={
            getCountdownValueByParsedEvents(
              parsedGatheringRarePopEvents,
              eorzeaTime.currentLt,
            ) ?? '通常'
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: px2DpY(12),
    paddingBottom: px2DpY(12),
    paddingLeft: px2DpX(24),
    paddingRight: px2DpX(24),
    gap: px2DpX(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    height: px2DpY(56),
    justifyContent: 'space-between',
  },
  contentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(3),
  },
  itemName: {
    fontSize: px2DpY(14),
  },
  itemDescRow: {
    lineHeight: px2DpY(18),
    fontSize: px2DpY(13),
  },
  rightContainer: {
    width: px2DpX(72),
  },
  itemIcon: {
    height: px2DpY(56),
    width: px2DpY(56),
    borderRadius: px2DpY(28),
  },
});

export default memo(
  GatheringItem,
  (prev, next) =>
    prev.timeTable.length === 0 ||
    prev.eorzeaTime.currentLt === next.eorzeaTime.currentLt,
);
