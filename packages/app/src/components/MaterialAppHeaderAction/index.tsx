import {Animated, Easing, Pressable, StyleSheet} from 'react-native';
import {memo, useEffect, useMemo, useRef} from 'react';
import type {FC} from 'react';
import type {MaterialAppHeaderAction as MaterialAppHeaderActionType} from './typings';
import {px2DpY} from '../../utils/dimensionConverter';
import {useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconFont from '../IconFont';

const MaterialAppHeaderAction: FC<
  MaterialAppHeaderActionType.Props
> = props => {
  const theme = useTheme<typeof DefaultLightTheme>();
  const {
    size = px2DpY(40),
    iconSize = px2DpY(25),
    iconColor = theme.colors.primaryContentText,
    style: restStyle,
    initAnimation = true,
    hide = false,
    useIconFont = false,
    onPress,
    icon,
  } = props;
  const cachedIcon = useMemo(
    () =>
      useIconFont ? (
        <IconFont name={icon} size={iconSize} color={iconColor} />
      ) : (
        <MaterialIcons name={icon} size={iconSize} color={iconColor} />
      ),
    [icon, iconColor, iconSize, useIconFont],
  );
  const iconRotateAnimValue = useRef(new Animated.Value(0)).current;
  const startIconRotateIcon = () => {
    Animated.sequence([
      Animated.timing(iconRotateAnimValue, {
        toValue: 1,
        duration: 60,
        easing: Easing.in(Easing.poly(1)),
        useNativeDriver: true,
      }),
      Animated.timing(iconRotateAnimValue, {
        toValue: 0,
        duration: 60,
        easing: Easing.in(Easing.poly(1)),
        useNativeDriver: true,
      }),
    ]).start();
  };
  useEffect(() => {
    if (initAnimation) {
      startIconRotateIcon();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initAnimation, hide]);
  return (
    <Animated.View
      style={[
        styles.container,
        {borderRadius: size / 2, display: hide ? 'none' : 'flex'},
        {
          transform: [
            {
              rotate: iconRotateAnimValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '-30deg'],
              }),
            },
          ],
        },
        restStyle,
      ]}>
      <Pressable
        style={[styles.pressable, {width: size, height: size}]}
        android_ripple={{color: theme.colors.rippleBackgroundColor}}
        onPress={onPress}
        unstable_pressDelay={0}>
        {cachedIcon}
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(MaterialAppHeaderAction);
