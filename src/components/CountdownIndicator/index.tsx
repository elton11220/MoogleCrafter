import {FC, memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {CountdownIndicatorTypes} from './typings';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';

export enum IndicatorType {
  LOCAL_TIME,
  EORZEA_TIME,
  ALARM_ICON,
}

const CountdownIndicator: FC<CountdownIndicatorTypes.Props> = props => {
  const {value, type, activated} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <View style={styles.container}>
      {type === IndicatorType.LOCAL_TIME ? (
        <Text
          style={[
            styles.countdownPrefix,
            {
              color: theme.colors.tertiaryContentText,
            },
          ]}>
          本
        </Text>
      ) : type === IndicatorType.EORZEA_TIME ? (
        <Text
          style={[
            styles.countdownPrefix,
            {
              color: theme.colors.tertiaryContentText,
            },
          ]}>
          艾
        </Text>
      ) : type === IndicatorType.ALARM_ICON ? (
        <MaterialCommunityIcons
          size={px2DpY(13)}
          name="alarm"
          color={
            activated ? theme.colors.primary : theme.colors.tertiaryContentText
          }
        />
      ) : null}
      <Text
        style={[
          styles.countdownValue,
          {
            color: activated
              ? type === IndicatorType.ALARM_ICON
                ? theme.colors.primary
                : theme.colors.primaryContentText
              : type === IndicatorType.ALARM_ICON
              ? theme.colors.secondaryContentText
              : theme.colors.primaryContentText,
          },
        ]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: px2DpX(2),
  },
  countdownPrefix: {
    fontSize: px2DpY(12),
  },
  countdownValue: {
    fontSize: px2DpY(13),
  },
});

export default memo(CountdownIndicator);
