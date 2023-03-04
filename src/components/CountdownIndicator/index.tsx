import {useMemo, memo} from 'react';
import type {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {MD3DarkTheme, MD3LightTheme, Text, useTheme} from 'react-native-paper';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {CountdownIndicatorTypes} from './typings';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {
  extendedDarkColors,
  extendedLightColors,
} from '../../config/themes/extension';

export enum IndicatorType {
  LOCAL_TIME,
  EORZEA_TIME,
  ALARM_ICON,
}

const CountdownIndicator: FC<CountdownIndicatorTypes.Props> = props => {
  const {value, type, activated, theme: themeType} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const themeColors = useMemo(
    () =>
      themeType
        ? {
            primaryContentText:
              themeType === 'light'
                ? extendedLightColors.primaryContentText
                : themeType === 'dark'
                ? extendedDarkColors.primaryContentText
                : theme.colors.primaryContentText,
            secondaryContentText:
              themeType === 'light'
                ? extendedLightColors.secondaryContentText
                : themeType === 'dark'
                ? extendedDarkColors.secondaryContentText
                : theme.colors.secondaryContentText,
            tertiaryContentText:
              themeType === 'light'
                ? extendedLightColors.tertiaryContentText
                : themeType === 'dark'
                ? extendedDarkColors.tertiaryContentText
                : theme.colors.tertiaryContentText,
            primary:
              themeType === 'light'
                ? MD3LightTheme.colors.primary
                : themeType === 'dark'
                ? MD3DarkTheme.colors.primary
                : theme.colors.primary,
          }
        : {
            primaryContentText: theme.colors.primaryContentText,
            secondaryContentText: theme.colors.secondaryContentText,
            tertiaryContentText: theme.colors.tertiaryContentText,
            primary: theme.colors.primary,
          },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      theme.colors.primary,
      theme.colors.primaryContentText,
      theme.colors.secondaryContentText,
      theme.colors.tertiaryContentText,
    ],
  );
  return (
    <View style={styles.container}>
      {type === IndicatorType.LOCAL_TIME ? (
        <Text
          style={[
            styles.countdownPrefix,
            {
              color: themeColors.tertiaryContentText,
            },
          ]}>
          本
        </Text>
      ) : type === IndicatorType.EORZEA_TIME ? (
        <Text
          style={[
            styles.countdownPrefix,
            {
              color: themeColors.tertiaryContentText,
            },
          ]}>
          艾
        </Text>
      ) : type === IndicatorType.ALARM_ICON ? (
        <MaterialCommunityIcons
          size={px2DpY(13)}
          name="alarm"
          color={
            activated ? themeColors.primary : themeColors.tertiaryContentText
          }
        />
      ) : null}
      <Text
        style={[
          styles.countdownValue,
          {
            color: activated
              ? type === IndicatorType.ALARM_ICON
                ? themeColors.primary
                : themeColors.primaryContentText
              : type === IndicatorType.ALARM_ICON
              ? themeColors.secondaryContentText
              : themeColors.primaryContentText,
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
