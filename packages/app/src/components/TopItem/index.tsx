import React, {FC, memo, useMemo, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Vibration,
  Animated,
  Easing,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {itemIcons} from '../../images/gameResource';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {
  getCountdownValueByParsedEvents,
  getTimeTableFromGatheringPoints,
  parseGatheringRarePopEvents,
} from '../../utils/eorzeaTime';
import CountdownIndicator, {IndicatorType} from '../CountdownIndicator';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import FastImage from 'react-native-fast-image';

const TopItem: FC<TopItemTypes.Props> = props => {
  const {gatheringItem, eorzeaTime, onRemovePressed, longPresssable} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const timeTable = useMemo(
    () => getTimeTableFromGatheringPoints(gatheringItem.gatheringPoints),
    [gatheringItem.gatheringPoints],
  );
  const parsedGatheringRarePopEvents = parseGatheringRarePopEvents(
    timeTable,
    eorzeaTime.currentEt,
  );
  const [longPressed, setLongPressed] = useState(false);
  const maskOpacityAnim = useRef(new Animated.Value(0)).current;
  const iconOffsetAnim = useRef(new Animated.Value(10)).current;
  const longPressedInAnim = () => {
    Animated.parallel([
      Animated.timing(maskOpacityAnim, {
        toValue: 1,
        duration: 130,
        easing: Easing.in(Easing.poly(1)),
        useNativeDriver: true,
      }),
      Animated.timing(iconOffsetAnim, {
        toValue: 0,
        duration: 130,
        easing: Easing.in(Easing.poly(1)),
        useNativeDriver: true,
      }),
    ]).start();
  };
  const longPressedOutAnim = (cb: () => void) => {
    Animated.parallel([
      Animated.timing(maskOpacityAnim, {
        toValue: 0,
        duration: 130,
        easing: Easing.in(Easing.poly(1)),
        useNativeDriver: true,
      }),
      Animated.timing(iconOffsetAnim, {
        toValue: 10,
        duration: 130,
        easing: Easing.in(Easing.poly(1)),
        useNativeDriver: true,
      }),
    ]).start(cb);
  };
  const onItemLongPressed = () => {
    if (longPresssable && longPressed === false) {
      setLongPressed(true);
      longPressedInAnim();
      Vibration.vibrate(100);
      setTimeout(() => {
        longPressedOutAnim(() => {
          setLongPressed(false);
        });
      }, 1500);
    }
  };
  return (
    <Pressable
      onLongPress={onItemLongPressed}
      android_ripple={{
        color: theme.colors.rippleBackgroundColor,
      }}
      delayLongPress={300}>
      <View style={styles.topItemContainer}>
        <View>
          <FastImage
            style={styles.itemIcon}
            source={itemIcons.get(gatheringItem.icon.toString())}
            resizeMode={FastImage.resizeMode.stretch}
          />
          {longPressed ? (
            <Pressable
              style={styles.longPressMaskPressable}
              onPress={() => {
                onRemovePressed(gatheringItem.id);
              }}>
              <Animated.View
                style={[styles.longPressMaskBg, {opacity: maskOpacityAnim}]}>
                <Animated.View
                  style={[styles.longPressMask, {translateY: iconOffsetAnim}]}>
                  <MaterialCommunityIcons
                    name="delete"
                    color="#fff"
                    size={px2DpY(24)}
                  />
                </Animated.View>
              </Animated.View>
            </Pressable>
          ) : null}
        </View>
        <View style={styles.topItemDetailContainer}>
          <Text
            style={styles.topItemTitle}
            numberOfLines={1}
            allowFontScaling={false}>
            {gatheringItem.name}
          </Text>
          <CountdownIndicator
            value={
              getCountdownValueByParsedEvents(
                parsedGatheringRarePopEvents,
                eorzeaTime.currentLt,
              ) ?? '-'
            }
            type={IndicatorType.ALARM_ICON}
            activated={
              parsedGatheringRarePopEvents.sortedOccurringEvents.length > 0
                ? true
                : false
            }
          />
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  topItemContainer: {
    width: px2DpX(71.6),
    alignItems: 'center',
    justifyContent: 'center',
    gap: px2DpY(8),
    paddingTop: px2DpY(16),
    paddingBottom: px2DpY(16),
    position: 'relative',
  },
  topItemDetailContainer: {
    alignItems: 'center',
    gap: px2DpY(2),
  },
  topItemTitle: {
    fontSize: px2DpY(14),
  },
  longPressMaskPressable: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: px2DpY(50),
    height: px2DpY(50),
    borderRadius: px2DpY(25),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  longPressMaskBg: {
    backgroundColor: 'rgba(0,0,0,.4)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  longPressMask: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemIcon: {
    height: px2DpY(50),
    width: px2DpY(50),
    borderRadius: px2DpY(25),
  },
});

export default memo(
  TopItem,
  (prev, next) => prev.eorzeaTime.currentLt === next.eorzeaTime.currentLt,
);
