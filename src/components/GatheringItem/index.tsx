import React, {FC, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Avatar, Text, useTheme} from 'react-native-paper';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {itemIcons} from '../../images/gameResource';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import GatheringItemTimerGroup from '../GatheringItemTimerGroup';

const GatheringItem: FC<GatheringItem.Props> = props => {
  const {gatheringListItem} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const timeTable = useMemo(() => {
    return [
      {
        startTime: gatheringListItem.startTime0,
        duration: gatheringListItem.duration0,
      },
      {
        startTime: gatheringListItem.startTime1,
        duration: gatheringListItem.duration1,
      },
      {
        startTime: gatheringListItem.startTime2,
        duration: gatheringListItem.duration2,
      },
    ];
  }, [
    gatheringListItem.duration0,
    gatheringListItem.duration1,
    gatheringListItem.duration2,
    gatheringListItem.startTime0,
    gatheringListItem.startTime1,
    gatheringListItem.startTime2,
  ]);
  return (
    <View style={styles.container}>
      <Avatar.Image
        size={px2DpY(56)}
        source={itemIcons.get(gatheringListItem.icon.toString())}
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
            {gatheringListItem.name}
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
            {`等级${gatheringListItem.gatheringItemLevel} ${gatheringListItem.classJob}`}
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
            {`${gatheringListItem.placeName} X: ${
              gatheringListItem.coordConverted ? gatheringListItem.x : '-'
            }, Y: ${
              gatheringListItem.coordConverted ? gatheringListItem.y : '-'
            }`}
          </Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <GatheringItemTimerGroup timeTable={timeTable} />
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
});

export default GatheringItem;
