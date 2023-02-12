import {FC, useMemo} from 'react';
import {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import useEorzeaTime from '../../context/eorzeaTimeContext/useEorzeaTime';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {
  GatheringRarePopEventState,
  getCountdownValueByParsedEvents,
  getPoppingEvent,
  parseGatheringRarePopEvents,
} from '../../utils/eorzeaTime';
import CountdownIndicator, {IndicatorType} from '../CountdownIndicator';

const GatheringItemTimerGroup: FC<GatheringItemTimerGroup.Props> = props => {
  const {timeTable} = props;
  const eorzeaTime = useEorzeaTime();
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
        startTimeLt: '-',
        startTimeEt: '-',
        state: null,
      };
    }
  }, [parsedGatheringRarePopEvents]);
  return (
    <View>
      <View style={styles.row}>
        <CountdownIndicator
          activated={false}
          type={IndicatorType.EORZEA_TIME}
          value={eventInfo.startTimeEt}
        />
      </View>
      <View style={styles.row}>
        <CountdownIndicator
          activated={false}
          type={IndicatorType.LOCAL_TIME}
          value={eventInfo.startTimeLt}
        />
      </View>
      <View style={styles.row}>
        <CountdownIndicator
          type={IndicatorType.ALARM_ICON}
          value={
            getCountdownValueByParsedEvents(
              parsedGatheringRarePopEvents,
              eorzeaTime.currentLt,
            ) ?? '-'
          }
          activated={eventInfo.state === GatheringRarePopEventState.OCCURRING}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    width: px2DpX(72),
    height: px2DpY(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});

export default memo(GatheringItemTimerGroup);
