import {View, StyleSheet, Pressable, Animated, Easing} from 'react-native';
import {useRef, useCallback, useEffect, memo} from 'react';
import type {FC} from 'react';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RegionDropdownMenuItem from '../RegionDropdownMenuItem';

const RegionDropdownMenuSection: FC<
  RegionDropdownMenuSection.Props
> = props => {
  const {
    id,
    label,
    onSelected,
    activated,
    activatedItemId,
    items,
    collapsed,
    onCollapse,
  } = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const collapsedIconRotateAnimValue = useRef(new Animated.Value(90)).current;
  const unfoldAnim = (callback?: Animated.EndCallback) => {
    Animated.parallel([
      Animated.timing(collapsedIconRotateAnimValue, {
        toValue: 0,
        duration: 150,
        easing: Easing.in(Easing.poly(1)),
        useNativeDriver: true,
      }),
    ]).start(callback);
  };
  const foldAnim = (callback?: Animated.EndCallback) => {
    Animated.parallel([
      Animated.timing(collapsedIconRotateAnimValue, {
        toValue: 90,
        duration: 150,
        easing: Easing.in(Easing.poly(1)),
        useNativeDriver: true,
      }),
    ]).start(callback);
  };
  const onSelectedItem = useCallback(
    (key: number) => {
      onSelected(id, key);
    },
    [id, onSelected],
  );
  useEffect(() => {
    if (collapsed === false) {
      foldAnim();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsed]);
  return (
    <View>
      <Pressable
        android_ripple={{color: theme.colors.rippleBackgroundColor}}
        style={styles.headerItem}
        onPress={() => {
          unfoldAnim(() => {
            onCollapse(id);
          });
        }}>
        <Text
          allowFontScaling={false}
          style={[
            styles.label,
            {
              color: activated
                ? theme.colors.primary
                : theme.colors.secondaryContentText,
            },
          ]}>
          {label}
        </Text>
        {activated ? (
          <View
            style={[
              styles.activatedIndicator,
              {backgroundColor: theme.colors.primary},
            ]}
          />
        ) : (
          <Animated.View
            style={{
              transform: [
                {
                  rotate: collapsedIconRotateAnimValue.interpolate({
                    inputRange: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
                    outputRange: [
                      '0deg',
                      '10deg',
                      '20deg',
                      '30deg',
                      '40deg',
                      '50deg',
                      '60deg',
                      '70deg',
                      '80deg',
                      '90deg',
                    ],
                  }),
                },
              ],
            }}>
            <MaterialIcons
              name="arrow-drop-down"
              size={px2DpY(18)}
              color={theme.colors.tertiaryContentText}
            />
          </Animated.View>
        )}
      </Pressable>
      {collapsed ? (
        <View>
          {items.map(item => (
            <RegionDropdownMenuItem
              key={item.key}
              id={item.key}
              label={item.name}
              selected={activatedItemId === item.key}
              onSelected={onSelectedItem}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerItem: {
    paddingLeft: px2DpX(10),
    paddingRight: px2DpX(5),
    paddingTop: px2DpY(7),
    paddingBottom: px2DpY(7),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(20),
  },
  activatedIndicator: {
    height: px2DpY(5),
    width: px2DpY(5),
    borderRadius: px2DpY(2.5),
    marginRight: px2DpX(6),
  },
  collapsedIcon: {
    transform: [
      {
        rotate: '90deg',
      },
    ],
  },
});

export default memo(RegionDropdownMenuSection);
