import {memo, useEffect, useMemo, useRef} from 'react';
import type {FC} from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Vibration,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text, useTheme} from 'react-native-paper';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {itemIcons} from '../../images/gameResource';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {
  GatheringRarePopEventState,
  getCountdownValueByParsedEvents,
  getPoppingEvent,
  getPoppingGatheringPointByParsedEvents,
  parseGatheringRarePopEvents,
} from '../../utils/eorzeaTime';
import GatheringItemTimerGroup from '../GatheringItemTimerGroup';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useStore} from '../../store';

const GatheringItem: FC<GatheringItem.Props> = props => {
  const {
    timeTable,
    gatheringItem,
    eorzeaTime,
    selected,
    onPressed,
    onLongPressed,
    onIconPressed,
  } = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const {favoriteGatheringItemIds, remindedGatheringItemIds} = useStore(s => ({
    favoriteGatheringItemIds: s.favoriteGatheringItemIds,
    remindedGatheringItemIds: s.remindedGatheringItemIds,
  }));
  const parsedGatheringRarePopEvents = parseGatheringRarePopEvents(
    timeTable,
    eorzeaTime.currentEt,
  );
  const eventInfo = useMemo(() => {
    const poppingEvent = getPoppingEvent(parsedGatheringRarePopEvents);
    if (poppingEvent !== null) {
      return {
        startTimeLt: poppingEvent.startTimeLt.format('HH:mm'),
        startTimeEt: poppingEvent.startTimeEt.format('HH:mm'),
        state: poppingEvent.state,
      };
    } else {
      return {
        startTimeLt: '--',
        startTimeEt: '--',
        state: null,
      };
    }
  }, [parsedGatheringRarePopEvents]);
  const gatheringPointDetail = getPoppingGatheringPointByParsedEvents(
    gatheringItem.gatheringPoints,
    parsedGatheringRarePopEvents,
  );
  const selectedIconOpacityAnimValue = useRef(new Animated.Value(0)).current;
  const showSelectedIcon = () => {
    Animated.timing(selectedIconOpacityAnimValue, {
      toValue: 1,
      duration: 90,
      easing: Easing.in(Easing.poly(1)),
      useNativeDriver: true,
    }).start();
  };
  const hideSelectedIcon = () => {
    Animated.timing(selectedIconOpacityAnimValue, {
      toValue: 0,
      duration: 90,
      easing: Easing.in(Easing.poly(1)),
      useNativeDriver: true,
    }).start();
  };
  const innerSelectionValue = useRef(false);
  useEffect(() => {
    if (selected !== innerSelectionValue.current) {
      if (selected) {
        innerSelectionValue.current = true;
        Vibration.vibrate(100);
        showSelectedIcon();
      } else {
        innerSelectionValue.current = false;
        hideSelectedIcon();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, innerSelectionValue]);
  const pressIcon = () => {
    onIconPressed(gatheringItem);
  };
  const itemIcon = useMemo(
    () => (
      <FastImage
        style={styles.itemIcon}
        source={itemIcons.get(gatheringItem.icon.toString())}
        resizeMode={FastImage.resizeMode.stretch}
      />
    ),
    [gatheringItem.icon],
  );
  const itemDetail = useMemo(
    () => (
      <View style={styles.contentContainer}>
        <View style={styles.contentTitleRow}>
          <Text
            style={[
              styles.itemName,
              {
                color: theme.colors.primaryContentText,
              },
            ]}
            numberOfLines={1}
            allowFontScaling={false}>
            {gatheringItem.name}
          </Text>
          {remindedGatheringItemIds.has(gatheringItem.id) ? (
            <MaterialIcons
              name="notifications-active"
              size={px2DpY(14)}
              color={theme.colors.tertiaryContentText}
            />
          ) : null}
          {favoriteGatheringItemIds.has(gatheringItem.id) ? (
            <MaterialIcons
              name="favorite"
              size={px2DpY(14)}
              color={theme.colors.tertiaryContentText}
            />
          ) : null}
        </View>
        <View>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={[
              styles.itemDescRow,
              {
                color: theme.colors.secondaryContentText,
              },
            ]}>
            {`等级${gatheringItem.gatheringItemLevel} ${
              gatheringPointDetail.classJob ?? '-'
            }`}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            style={[
              styles.itemDescRow,
              {
                color: theme.colors.secondaryContentText,
              },
            ]}>
            {`${gatheringPointDetail?.placeName ?? '-'} X: ${
              gatheringPointDetail?.x ?? '-'
            }, Y: ${gatheringPointDetail?.y ?? '-'}`}
          </Text>
        </View>
      </View>
    ),
    [
      favoriteGatheringItemIds,
      gatheringItem.gatheringItemLevel,
      gatheringItem.id,
      gatheringItem.name,
      gatheringPointDetail.classJob,
      gatheringPointDetail?.placeName,
      gatheringPointDetail?.x,
      gatheringPointDetail?.y,
      remindedGatheringItemIds,
      theme.colors.primaryContentText,
      theme.colors.secondaryContentText,
      theme.colors.tertiaryContentText,
    ],
  );
  return (
    <Pressable
      style={styles.container}
      android_ripple={{color: theme.colors.rippleBackgroundColor}}
      onPress={() => {
        onPressed(gatheringItem);
      }}
      onLongPress={() => {
        onLongPressed(gatheringItem);
      }}
      delayLongPress={150}
      unstable_pressDelay={0}>
      <View style={styles.itemIconContainer}>
        <Pressable
          android_ripple={{color: theme.colors.rippleBackgroundColor}}
          onPress={pressIcon}
          style={styles.itemIcon}>
          {itemIcon}
          <Animated.View
            style={[
              styles.itemIcon,
              styles.selectedIcon,
              {
                backgroundColor: theme.colors.primaryContainer,
                opacity: selectedIconOpacityAnimValue,
              },
            ]}>
            <MaterialIcons
              name="check"
              size={px2DpY(28)}
              color={theme.colors.primary}
            />
          </Animated.View>
        </Pressable>
      </View>
      {itemDetail}
      <View style={styles.rightContainer}>
        <GatheringItemTimerGroup
          startTimeLt={eventInfo.startTimeLt}
          startTimeEt={eventInfo.startTimeEt}
          countdownActivate={
            eventInfo.state === GatheringRarePopEventState.OCCURRING
          }
          countdownValue={
            getCountdownValueByParsedEvents(
              parsedGatheringRarePopEvents,
              eorzeaTime.currentLt,
            ) ?? '通常'
          }
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: px2DpY(12),
    paddingBottom: px2DpY(12),
    paddingLeft: px2DpX(24),
    paddingRight: px2DpX(24),
    gap: px2DpX(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    height: px2DpY(56),
    justifyContent: 'space-between',
  },
  contentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(3),
  },
  itemName: {
    fontSize: px2DpY(14),
  },
  itemDescRow: {
    lineHeight: px2DpY(18),
    fontSize: px2DpY(13),
  },
  rightContainer: {
    width: px2DpX(72),
  },
  itemIcon: {
    height: px2DpY(56),
    width: px2DpY(56),
    borderRadius: px2DpY(28),
  },
  selectedIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  itemIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    height: px2DpY(56),
    width: px2DpY(56),
    borderRadius: px2DpY(28),
  },
});

export default memo(
  GatheringItem,
  (prev, next) =>
    (prev.timeTable.length === 0 ||
      prev.eorzeaTime.currentLt === next.eorzeaTime.currentLt) &&
    prev.selected === next.selected &&
    prev.onPressed === next.onPressed,
);
