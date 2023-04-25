import {FC} from 'react';
import {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import CountdownIndicator, {IndicatorType} from '../CountdownIndicator';

const GatheringItemTimerGroup: FC<GatheringItemTimerGroup.Props> = props => {
  const {
    startTimeEt,
    startTimeLt,
    countdownActivate,
    countdownValue,
    theme: themeType,
  } = props;
  return (
    <View>
      <View style={styles.row}>
        <CountdownIndicator
          activated={false}
          type={IndicatorType.EORZEA_TIME}
          value={startTimeEt}
          theme={themeType}
        />
      </View>
      <View style={styles.row}>
        <CountdownIndicator
          activated={false}
          type={IndicatorType.LOCAL_TIME}
          value={startTimeLt}
          theme={themeType}
        />
      </View>
      <View style={styles.row}>
        <CountdownIndicator
          type={IndicatorType.ALARM_ICON}
          value={countdownValue}
          activated={countdownActivate}
          theme={themeType}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: px2DpX(60),
    height: px2DpY(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default memo(GatheringItemTimerGroup);
