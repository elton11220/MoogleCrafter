import {View, StyleSheet, Pressable} from 'react-native';
import {memo} from 'react';
import type {FC} from 'react';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import type {SoundChips as SoundChipsTypes} from './typings';
import {playSound} from '../../native/SpecialRingtone';

const SoundChips: FC<SoundChipsTypes.Props> = props => {
  const {title, exVersion} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const onPress = () => {
    playSound(exVersion).then();
  };
  return (
    <View style={[styles.container]}>
      <Pressable
        android_ripple={{
          color: theme.colors.rippleBackgroundColor,
        }}
        style={[
          styles.rippleContainer,
          {backgroundColor: theme.colors.primaryContainer},
        ]}
        onPress={onPress}>
        <MaterialIcons
          name="volume-up"
          size={px2DpY(24)}
          color={theme.colors.primaryContentText}
        />
        <Text allowFontScaling={false} style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: px2DpY(34),
    borderRadius: px2DpY(17),
    overflow: 'hidden',
    flexGrow: 1,
  },
  rippleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(8),
    height: px2DpY(34),
    paddingLeft: px2DpX(6),
    paddingRight: px2DpX(10),
  },
  title: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(20),
    fontWeight: 'bold',
    flexGrow: 1,
    textAlign: 'center',
  },
});

export default memo(SoundChips);
