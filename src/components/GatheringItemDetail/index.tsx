import {View, StyleSheet} from 'react-native';
import type {FC} from 'react';
import {memo} from 'react';
import {px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import Tip from '../Tip';
import {ExVersions} from '../../utils/eorzeaConstant';

const GatheringItemDetail: FC<GatheringItemDetail.Props> = props => {
  const {gatheringItem, poppingGatheringPoint, footerTip} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text
            style={[
              styles.itemTitle,
              {color: theme.colors.secondaryContentText},
            ]}
            allowFontScaling={false}>
            采集职业
          </Text>
          <Text
            style={[
              styles.itemContent,
              {color: theme.colors.primaryContentText},
            ]}
            allowFontScaling={false}>
            {poppingGatheringPoint.classJob ?? '--'}
          </Text>
        </View>
        <View style={styles.item}>
          <Text
            style={[
              styles.itemTitle,
              {color: theme.colors.secondaryContentText},
            ]}
            allowFontScaling={false}>
            采集等级
          </Text>
          <Text
            style={[
              styles.itemContent,
              {color: theme.colors.primaryContentText},
            ]}
            allowFontScaling={false}>
            {gatheringItem.gatheringItemLevel}
          </Text>
        </View>
        <View style={styles.item}>
          <Text
            style={[
              styles.itemTitle,
              {color: theme.colors.secondaryContentText},
            ]}
            allowFontScaling={false}>
            素材类别
          </Text>
          <Text
            style={[
              styles.itemContent,
              {color: theme.colors.primaryContentText},
            ]}
            allowFontScaling={false}>
            {gatheringItem.itemCategory}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text
            style={[
              styles.itemTitle,
              {color: theme.colors.secondaryContentText},
            ]}
            allowFontScaling={false}>
            出现版本
          </Text>
          <Text
            style={[
              styles.itemContent,
              {color: theme.colors.primaryContentText},
            ]}
            allowFontScaling={false}>
            {ExVersions[gatheringItem.exVersion]}
          </Text>
        </View>
        <View style={styles.item}>
          <Text
            style={[
              styles.itemTitle,
              {color: theme.colors.secondaryContentText},
            ]}
            allowFontScaling={false}>
            所在地图
          </Text>
          <Text
            style={[
              styles.itemContent,
              {color: theme.colors.primaryContentText},
            ]}
            allowFontScaling={false}>
            {poppingGatheringPoint.placeName}
          </Text>
        </View>
        <View style={styles.item}>
          <Text
            style={[
              styles.itemTitle,
              {color: theme.colors.secondaryContentText},
            ]}
            allowFontScaling={false}>
            采集坐标
          </Text>
          <Text
            style={[
              styles.itemContent,
              {color: theme.colors.primaryContentText},
            ]}
            allowFontScaling={false}>
            {`X:${poppingGatheringPoint.x}, Y:${poppingGatheringPoint.y}`}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text
            style={[
              styles.itemTitle,
              {color: theme.colors.secondaryContentText},
            ]}
            allowFontScaling={false}>
            传承录 / 采集类别
          </Text>
          <Text
            style={[
              styles.itemContent,
              {color: theme.colors.primaryContentText},
            ]}
            allowFontScaling={false}>
            {gatheringItem.folkloreBook ?? '--'}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text
            style={[
              styles.itemTitle,
              {color: theme.colors.secondaryContentText},
            ]}
            allowFontScaling={false}>
            特性
          </Text>
          {poppingGatheringPoint.gatheringPointBonus.length > 0 ? (
            poppingGatheringPoint.gatheringPointBonus.map((bonus, index) => (
              <Text
                key={index}
                style={[
                  styles.itemContent,
                  {color: theme.colors.primaryContentText},
                ]}
                allowFontScaling={false}>
                {`${bonus.condition}, ${bonus.bonusType}`}
              </Text>
            ))
          ) : (
            <Text
              style={[
                styles.itemContent,
                {color: theme.colors.primaryContentText},
              ]}
              allowFontScaling={false}>
              --
            </Text>
          )}
        </View>
      </View>
      {footerTip ? <Tip title={footerTip} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: px2DpY(15),
    gap: px2DpY(20),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: px2DpY(3),
  },
  itemTitle: {
    fontSize: px2DpY(12),
    lineHeight: px2DpY(16),
  },
  itemContent: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(18),
  },
});

export default memo(
  GatheringItemDetail,
  (prev, next) =>
    prev.poppingGatheringPoint.gatheringPointBaseId ===
      next.poppingGatheringPoint.gatheringPointBaseId &&
    prev.gatheringItem.id === next.gatheringItem.id &&
    prev.footerTip === next.footerTip,
);
