import {View, StyleSheet, Pressable} from 'react-native';
import {useCallback, useMemo} from 'react';
import type {FC} from 'react';
import {memo} from 'react';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import CountdownIndicator, {IndicatorType} from '../CountdownIndicator';

const GatheringPointSummary: FC<GatheringPointSummary.Props> = props => {
  const {
    startTimeEt,
    startTimeLt,
    countdownActivate,
    countdownValue,
    regionName,
    prefix,
    coordinate,
    gatheringPointBaseId,
    onPress,
  } = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const onPressItem = useCallback(() => {
    onPress?.(gatheringPointBaseId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const prefixEle = useMemo(
    () => (
      <View style={styles.prefixContainer}>
        <Text
          style={[
            styles.prefixText,
            {color: theme.colors.secondaryContentText},
          ]}
          allowFontScaling={false}>
          {prefix}
        </Text>
      </View>
    ),
    [prefix, theme.colors.secondaryContentText],
  );
  const contentEle = useMemo(
    () => (
      <View style={styles.contentContainer}>
        <Text
          allowFontScaling={false}
          style={[
            styles.contentTitle,
            {color: theme.colors.primaryContentText},
          ]}>
          {startTimeEt !== null
            ? `艾 ${startTimeEt} 本 ${startTimeLt}`
            : '非限时采集点'}
        </Text>
        <Text
          allowFontScaling={false}
          style={[
            styles.contentDesc,
            {color: theme.colors.tertiaryContentText},
          ]}>{`${regionName} ${coordinate}`}</Text>
      </View>
    ),
    [
      coordinate,
      regionName,
      startTimeEt,
      startTimeLt,
      theme.colors.primaryContentText,
      theme.colors.tertiaryContentText,
    ],
  );
  return (
    <Pressable style={styles.container} onPress={onPressItem}>
      {prefixEle}
      {contentEle}
      <View style={styles.countdownContainer}>
        <Text
          allowFontScaling={false}
          style={[
            styles.gatheringPointStateText,
            {
              color: countdownActivate
                ? theme.colors.primary
                : theme.colors.tertiaryContentText,
            },
          ]}>
          {countdownActivate ? '出现中' : '等待中'}
        </Text>
        <CountdownIndicator
          value={countdownValue || '--:--'}
          type={IndicatorType.ALARM_ICON}
          activated={countdownActivate}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: px2DpX(25),
    paddingRight: px2DpX(25),
    paddingTop: px2DpY(4),
    paddingBottom: px2DpY(4),
    gap: px2DpX(10),
    flexDirection: 'row',
    alignItems: 'center',
    // borderWidth: 1,
  },
  prefixContainer: {
    width: px2DpX(23),
    height: '100%',
    alignItems: 'center',
  },
  prefixText: {
    lineHeight: px2DpY(20),
    fontSize: px2DpY(12),
  },
  contentContainer: {
    flex: 1,
  },
  contentTitle: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(20),
  },
  contentDesc: {
    fontSize: px2DpY(12),
    lineHeight: px2DpY(20),
  },
  countdownContainer: {
    flexDirection: 'row',
    gap: px2DpX(3),
  },
  gatheringPointStateText: {
    lineHeight: px2DpY(17),
    fontSize: px2DpY(13),
  },
});

export default memo(GatheringPointSummary);
