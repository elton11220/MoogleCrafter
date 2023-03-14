import type {FC} from 'react';
import {memo} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpY} from '../../utils/dimensionConverter';
import AnimatedBackgroundColorView from '../AnimatedBackgroundColorView';
import type {AnimatedBgColorFilterButton as AnimatedBgColorFilterButtonType} from './typings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const AnimatedBgColorFilterButton: FC<
  AnimatedBgColorFilterButtonType.Props
> = props => {
  const theme = useTheme<typeof DefaultLightTheme>();
  const {
    style: restStyle,
    activated,
    activatedBg,
    onPress,
    activatedIconColor = theme.colors.surfaceVariant,
    activatedContainerColor = theme.colors.primary,
    deactivatedIconColor = theme.colors.primary,
    deactivatedContainerColor = theme.colors.surfaceVariant,
    iconSize = px2DpY(18),
    size = px2DpY(50),
  } = props;
  return (
    <AnimatedBackgroundColorView
      activated={activatedBg}
      initialColor={
        activated ? activatedContainerColor : deactivatedContainerColor
      }
      activeColor={
        activated ? activatedContainerColor : theme.colors.background
      }
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        restStyle,
      ]}>
      <Pressable
        onPress={onPress}
        android_ripple={{color: theme.colors.rippleBackgroundColor}}
        style={styles.pressable}>
        <MaterialCommunityIcons
          name="image-filter-none"
          color={activated ? activatedIconColor : deactivatedIconColor}
          size={iconSize}
        />
      </Pressable>
    </AnimatedBackgroundColorView>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  pressable: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(AnimatedBgColorFilterButton);
