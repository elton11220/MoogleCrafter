import {StyleSheet, View} from 'react-native';
import {memo} from 'react';
import type {FC} from 'react';
import {Text, useTheme} from 'react-native-paper';
import useEorzeaTimer from '../../hooks/useEorzeaTimer';
import moment from 'moment';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpY} from '../../utils/dimensionConverter';

const EorzeaTimeDisplayer: FC<EorzeaTimeDisplayer.Props> = () => {
  const eorzeaTime = useEorzeaTimer();
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text
          allowFontScaling={false}
          style={[styles.text, {color: theme.colors.tertiaryContentText}]}>
          ET {moment(eorzeaTime.currentEt).utc().format('HH:mm:ss')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'center',
    flex: 1,
  },
  row: {
    height: px2DpY(25),
    justifyContent: 'flex-end',
  },
  text: {
    fontSize: px2DpY(12),
    lineHeight: px2DpY(15),
  },
});

export default memo(EorzeaTimeDisplayer);
