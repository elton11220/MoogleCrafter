import {memo, useEffect, useRef, useState} from 'react';
import type {FC} from 'react';
import {Animated, Easing} from 'react-native';
import type {AnimatedBackgroundColorView as AnimatedBackgroundColorViewType} from './typings';

const AnimatedBackgroundColorView: FC<
  AnimatedBackgroundColorViewType.Props
> = props => {
  const {
    children,
    initialColor,
    activeColor,
    activated,
    easing = Easing.in(Easing.poly(2)),
    duration = 200,
    style,
  } = props;
  const backgroundColorAnimValue = useRef(new Animated.Value(0)).current;
  const activateBackground = () => {
    Animated.timing(backgroundColorAnimValue, {
      toValue: 1,
      duration,
      easing,
      useNativeDriver: false,
    }).start();
  };
  const deactivateBackground = () => {
    Animated.timing(backgroundColorAnimValue, {
      toValue: 0,
      duration,
      easing,
      useNativeDriver: false,
    }).start();
  };
  const [currState, setCurrState] = useState<boolean>(false);
  useEffect(() => {
    if (currState !== activated) {
      if (activated) {
        activateBackground();
      } else {
        deactivateBackground();
      }
      setCurrState(activated);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currState, activated]);
  return (
    <Animated.View
      style={[
        style,
        {
          backgroundColor: backgroundColorAnimValue.interpolate({
            inputRange: [0, 1],
            outputRange: [initialColor, activeColor],
          }),
        },
      ]}>
      {children}
    </Animated.View>
  );
};

export default memo(AnimatedBackgroundColorView);
