import {
  StyleSheet,
  Animated,
  Pressable,
  Easing,
  ScrollView,
} from 'react-native';
import {memo, useRef} from 'react';
import type {FC} from 'react';
import {Portal, useTheme} from 'react-native-paper';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Drawer: FC<Drawer.Props> = props => {
  const {visible, onClose, closeOverlayClick, children, footer} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const insets = useSafeAreaInsets();
  const overlayOpacityAnimValue = useRef(new Animated.Value(0)).current;
  const drawerTransformAnimValue = useRef(
    new Animated.Value(px2DpX(300)),
  ).current;
  const showOverlayAnim = (callback?: Animated.EndCallback) => {
    Animated.parallel([
      Animated.timing(drawerTransformAnimValue, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.poly(3)),
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacityAnimValue, {
        toValue: 1,
        duration: 250,
        easing: Easing.in(Easing.poly(3)),
        useNativeDriver: true,
      }),
    ]).start(callback);
  };
  const hideOverlayAnim = (callback?: Animated.EndCallback) => {
    Animated.parallel([
      Animated.timing(overlayOpacityAnimValue, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.poly(3)),
        useNativeDriver: true,
      }),
      Animated.timing(drawerTransformAnimValue, {
        toValue: 300,
        duration: 220,
        easing: Easing.in(Easing.poly(3)),
        useNativeDriver: true,
      }),
    ]).start(callback);
  };
  const hideOverlay = () =>
    hideOverlayAnim(({finished}) => {
      if (finished) {
        onClose();
      }
    });
  if (visible) {
    showOverlayAnim();
  }
  return (
    <Portal>
      {visible ? (
        <Animated.View style={styles.container}>
          <Animated.View
            style={[styles.overlay, {opacity: overlayOpacityAnimValue}]}
          />
          <Pressable
            style={styles.overlayPressableArea}
            onPress={closeOverlayClick ? hideOverlay : undefined}
          />
          <Animated.View
            style={[
              styles.drawerContainer,
              {
                backgroundColor: theme.colors.background,
                marginTop: insets.top,
                paddingBottom: insets.bottom,
              },
              {
                transform: [{translateX: drawerTransformAnimValue}],
              },
            ]}>
            <ScrollView
              style={styles.scrollViewContainer}
              contentContainerStyle={[
                styles.contentContainer,
                {backgroundColor: theme.colors.containerDivider},
              ]}>
              {children}
            </ScrollView>
            {footer}
          </Animated.View>
        </Animated.View>
      ) : null}
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  overlay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.6)',
    position: 'absolute',
  },
  drawerContainer: {
    width: px2DpX(300),
    borderTopLeftRadius: px2DpY(10),
    borderBottomLeftRadius: px2DpY(10),
    paddingTop: px2DpY(12),
  },
  overlayPressableArea: {
    flexGrow: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    gap: px2DpY(10),
  },
});

export default memo(Drawer);
