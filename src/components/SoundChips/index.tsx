import {View, StyleSheet, Pressable} from 'react-native';
import type {FC} from 'react';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SoundChips: FC<SoundChips.Props> = props => {
  const {title} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
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
        onPress={() => {}}>
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

export default SoundChips;
