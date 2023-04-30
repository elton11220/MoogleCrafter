import {
  View,
  StyleSheet,
  ScrollView,
  Linking,
  Vibration,
  ToastAndroid,
} from 'react-native';
import {useCallback, useMemo, useState} from 'react';
import type {FC} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Appbar, List, Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import type {RootStackScreenProps} from '../../navigation/types';
import {
  getCountdownValueByParsedEvent,
  GatheringRarePopEventState,
  parseGatheringPoints,
} from '../../utils/eorzeaTime';
import useEorzeaTimer from '../../hooks/useEorzeaTimer';
import GatheringItemDetail from '../../components/GatheringItemDetail';
import FastImage from 'react-native-fast-image';
import {itemIcons} from '../../images/gameResource';
import GatheringItemTimerGroup from '../../components/GatheringItemTimerGroup';
import {GatheringTypes} from '../../utils/eorzeaConstant';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation, useRoute} from '@react-navigation/native';
import WebView from 'react-native-webview';
import GatheringPointSummary from '../../components/GatheringPointSummary';
import ShowMore from '../../components/ShowMore';
import IconFont from '../../components/IconFont';
import {
  gatheringPointBasesSelector,
  generalSettingsSelector,
  reductionItemsSelector,
  useStore,
} from '../../store';
import GatheringItemLite from '../../components/GatheringItemLite';
import {mapUrl} from '../../config/url';
import Tag from '../../components/Tag';
import Divider from '../../components/Divider';

const GATHERING_POINT_LIST_MAX_AMOUNT = 3;

const Detail: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const {
    params: {gatheringItem},
  } = useRoute<RootStackScreenProps<'Detail'>['route']>();
  const navigation = useNavigation();
  const eorzeaTime = useEorzeaTimer();
  const [isShowAllGatheringPoints, setShowAllGatheringPoints] = useState(false);
  const parsedGatheringPoints = parseGatheringPoints(
    gatheringItem.gatheringPoints,
    eorzeaTime.currentEt,
  );
  const gatheringPointAmount = useMemo(
    () => parsedGatheringPoints.gatheringPoints.length,
    [parsedGatheringPoints.gatheringPoints.length],
  );
  const gatheringPointGroupItemLimit = useMemo(() => {
    const occurringGatheringPointAmount =
      parsedGatheringPoints.sortedOccurringGatheringPoints.length;
    const preparingGatheringPointAmount =
      parsedGatheringPoints.sortedPreparingGatheringPoints.length;
    if (isShowAllGatheringPoints) {
      return {
        occurring: occurringGatheringPointAmount,
        preparing: preparingGatheringPointAmount,
      };
    } else {
      if (occurringGatheringPointAmount > GATHERING_POINT_LIST_MAX_AMOUNT) {
        return {
          occurring: GATHERING_POINT_LIST_MAX_AMOUNT,
          preparing: 0,
        };
      } else {
        if (gatheringPointAmount > GATHERING_POINT_LIST_MAX_AMOUNT) {
          return {
            occurring: occurringGatheringPointAmount,
            preparing: gatheringPointAmount - occurringGatheringPointAmount - 1,
          };
        } else {
          return {
            occurring: occurringGatheringPointAmount,
            preparing: preparingGatheringPointAmount,
          };
        }
      }
    }
  }, [
    gatheringPointAmount,
    isShowAllGatheringPoints,
    parsedGatheringPoints.sortedOccurringGatheringPoints.length,
    parsedGatheringPoints.sortedPreparingGatheringPoints.length,
  ]);
  const gatheringPointBases = useStore(gatheringPointBasesSelector);
  const {
    favoriteGatheringItemIds,
    remindedGatheringItemIds,
    addFavoriteGatheringItem,
    addGatheringItemReminder,
    removeFavoriteGatheringItem,
    removeGatheringItemReminder,
  } = useStore(s => ({
    favoriteGatheringItemIds: s.favoriteGatheringItemIds,
    remindedGatheringItemIds: s.remindedGatheringItemIds,
    addFavoriteGatheringItem: s.addFavoriteGatheringItem,
    addGatheringItemReminder: s.addGatheringItemReminder,
    removeFavoriteGatheringItem: s.removeFavoriteGatheringItem,
    removeGatheringItemReminder: s.removeGatheringItemReminder,
  }));
  const {
    showAllItemsOfGatheringPoint,
    enableFFCafeMapInDetail,
    placeNameDispMode,
  } = useStore(generalSettingsSelector);
  const getPlaceName = useCallback(
    (gatheringPointDetail: AppGlobal.GatheringPoint) => {
      if (gatheringPointDetail.placeNameForAetheryte) {
        if (placeNameDispMode === 'm') {
          return gatheringPointDetail.placeName;
        } else if (placeNameDispMode === 'a') {
          return gatheringPointDetail.placeNameForAetheryte;
        } else if (placeNameDispMode === 'ma') {
          return `${gatheringPointDetail.placeName} / ${gatheringPointDetail.placeNameForAetheryte}`;
        } else if (placeNameDispMode === 'am') {
          return `${gatheringPointDetail.placeNameForAetheryte} / ${gatheringPointDetail.placeName}`;
        }
      }
      return gatheringPointDetail.placeName;
    },
    [placeNameDispMode],
  );
  const isFavoriteItem = useMemo(
    () => favoriteGatheringItemIds.has(gatheringItem.id),
    [favoriteGatheringItemIds, gatheringItem.id],
  );
  const isRemindedItem = useMemo(
    () => remindedGatheringItemIds.has(gatheringItem.id),
    [gatheringItem.id, remindedGatheringItemIds],
  );
  const wikiAction = useMemo(
    () => (
      <Appbar.Action
        size={px2DpY(24)}
        iconColor={theme.colors.secondaryContentText}
        icon={({size, color}) => (
          <IconFont name="wiki" size={size} color={color} />
        )}
        onPress={() => {
          Linking.openURL(
            `https://ff14.huijiwiki.com/wiki/%E7%89%A9%E5%93%81:${encodeURIComponent(
              gatheringItem.name,
            )}`,
          );
        }}
      />
    ),
    [gatheringItem.name, theme.colors.secondaryContentText],
  );
  const favoriteAction = useMemo(
    () => (
      <Appbar.Action
        size={px2DpY(24)}
        iconColor={theme.colors.secondaryContentText}
        icon={({size, color}) => (
          <MaterialIcons
            name={isFavoriteItem ? 'favorite' : 'favorite-border'}
            size={size}
            color={color}
          />
        )}
        onPress={() => {
          if (isFavoriteItem) {
            removeFavoriteGatheringItem(
              new Map([[gatheringItem.id, gatheringItem]]),
            );
          } else {
            addFavoriteGatheringItem(
              new Map([[gatheringItem.id, gatheringItem]]),
            );
          }
          Vibration.vibrate(100);
        }}
      />
    ),
    [
      addFavoriteGatheringItem,
      gatheringItem,
      isFavoriteItem,
      removeFavoriteGatheringItem,
      theme.colors.secondaryContentText,
    ],
  );
  const remindedAction = useMemo(
    () => (
      <Appbar.Action
        size={px2DpY(24)}
        iconColor={theme.colors.secondaryContentText}
        icon={({size, color}) => (
          <MaterialIcons
            name={
              isRemindedItem ? 'notifications-active' : 'notifications-none'
            }
            size={size}
            color={color}
          />
        )}
        onPress={() => {
          if (isRemindedItem) {
            removeGatheringItemReminder(
              new Map([[gatheringItem.id, gatheringItem]]),
            );
          } else {
            addGatheringItemReminder(
              new Map([[gatheringItem.id, gatheringItem]]),
            );
          }
          Vibration.vibrate(100);
        }}
      />
    ),
    [
      addGatheringItemReminder,
      gatheringItem,
      isRemindedItem,
      removeGatheringItemReminder,
      theme.colors.secondaryContentText,
    ],
  );
  const appHeader = useMemo(
    () => (
      <Appbar.Header>
        <Appbar.BackAction
          rippleColor={theme.colors.rippleBackgroundColor}
          onPress={() => {
            navigation.goBack();
          }}
          size={px2DpY(24)}
        />
        <Appbar.Content title="资源详情" titleStyle={styles.titleStyle} />
        {wikiAction}
        {favoriteAction}
        {gatheringItem.isRare ? remindedAction : null}
      </Appbar.Header>
    ),
    [
      favoriteAction,
      gatheringItem.isRare,
      navigation,
      remindedAction,
      theme.colors.rippleBackgroundColor,
      wikiAction,
    ],
  );
  const infoCardContent = useMemo(() => {
    const starsEle = [];
    for (let i = 0; i < gatheringItem.gatheringItemStars; i++) {
      starsEle.push(
        <MaterialIcons
          key={i}
          name="star"
          size={px2DpY(16)}
          color={theme.colors.tertiaryContentText}
        />,
      );
    }
    return (
      <>
        <FastImage
          style={styles.itemIcon}
          source={itemIcons.get(gatheringItem.icon.toString())}
          resizeMode={FastImage.resizeMode.stretch}
        />
        <View style={styles.infoCardContent}>
          <Text
            allowFontScaling={false}
            style={[
              styles.infoCardTitle,
              {
                color: theme.colors.primaryContentText,
              },
            ]}>
            {gatheringItem.name}
          </Text>
          <View style={styles.infoCardDescRow}>
            <Text
              allowFontScaling={false}
              style={[
                styles.infoCardDesc,
                {
                  color: theme.colors.tertiaryContentText,
                },
              ]}>
              {`${
                GatheringTypes[
                  parsedGatheringPoints.poppingGatheringPoint.gatheringType
                ]
              } | ${gatheringItem.gatheringItemLevel}`}
            </Text>
            <View style={styles.starContainer}>
              {starsEle.map(item => item)}
            </View>
            {gatheringItem.isHidden ? <Tag>隐藏</Tag> : null}
            {gatheringItem.isReducible ? <Tag>可精选</Tag> : null}
          </View>
        </View>
      </>
    );
  }, [
    gatheringItem.gatheringItemLevel,
    gatheringItem.gatheringItemStars,
    gatheringItem.icon,
    gatheringItem.isHidden,
    gatheringItem.isReducible,
    gatheringItem.name,
    parsedGatheringPoints.poppingGatheringPoint.gatheringType,
    theme.colors.primaryContentText,
    theme.colors.tertiaryContentText,
  ]);
  const ffCafeMap = useMemo(
    () => (
      <List.Section
        style={[styles.listSectionContainer, {height: px2DpY(310)}]}>
        <List.Subheader
          style={[styles.listSectionTitleStyle, {color: theme.colors.primary}]}>
          采集点位置
        </List.Subheader>
        <View style={styles.ffCafeMapContainer}>
          <WebView
            source={{
              uri: `${mapUrl}/?mapId=${parsedGatheringPoints.poppingGatheringPoint.mapId}&x=${parsedGatheringPoints.poppingGatheringPoint.x}&y=${parsedGatheringPoints.poppingGatheringPoint.y}&zoom=-1`,
            }}
            scrollEnabled={false}
            startInLoadingState
          />
        </View>
      </List.Section>
    ),
    [
      parsedGatheringPoints.poppingGatheringPoint.mapId,
      parsedGatheringPoints.poppingGatheringPoint.x,
      parsedGatheringPoints.poppingGatheringPoint.y,
      theme.colors.primary,
    ],
  );
  const classifiedGatheringPointBaseItems = useMemo(
    () => ({
      normalItems: gatheringPointBases[
        parsedGatheringPoints.poppingGatheringPoint.gatheringPointBaseId
      ].filter(item => item.isHidden === false),
      hiddenItems: gatheringPointBases[
        parsedGatheringPoints.poppingGatheringPoint.gatheringPointBaseId
      ].filter(item => item.isHidden),
    }),
    [
      gatheringPointBases,
      parsedGatheringPoints.poppingGatheringPoint.gatheringPointBaseId,
    ],
  );
  const allGatheringPointItems = useMemo(
    () => (
      <List.Section style={styles.listSectionContainer}>
        <List.Subheader
          style={[styles.listSectionTitleStyle, {color: theme.colors.primary}]}>
          当前采集点物品
        </List.Subheader>
        <View style={styles.gatheringItemLiteWrappableContainer}>
          {classifiedGatheringPointBaseItems.normalItems.map((item, index) => (
            <GatheringItemLite key={index} data={item} />
          ))}
        </View>
        {classifiedGatheringPointBaseItems.hiddenItems.length > 0 ? (
          <>
            <Divider style={styles.dividerStyle} title="隐藏" />
            <View style={styles.gatheringItemLiteWrappableContainer}>
              {classifiedGatheringPointBaseItems.hiddenItems.map(
                (item, index) => (
                  <GatheringItemLite key={index} data={item} />
                ),
              )}
            </View>
          </>
        ) : null}
      </List.Section>
    ),
    [
      classifiedGatheringPointBaseItems.hiddenItems,
      classifiedGatheringPointBaseItems.normalItems,
      theme.colors.primary,
    ],
  );
  const reductionItems = useStore(reductionItemsSelector);
  const onReduceResultItemPress = useCallback(
    (id: number) => {
      const reductionItem = reductionItems?.[id];
      if (reductionItem) {
        navigation.navigate('ReductionDetail', reductionItem);
      } else {
        ToastAndroid.show(
          '精选数据不存在，请反馈数据缺失情况',
          ToastAndroid.SHORT,
        );
      }
    },
    [navigation, reductionItems],
  );
  const allReduceResultItems = useMemo(
    () => (
      <List.Section style={styles.listSectionContainer}>
        <List.Subheader
          style={[styles.listSectionTitleStyle, {color: theme.colors.primary}]}>
          精选结果
        </List.Subheader>
        <View style={styles.gatheringItemLiteWrappableContainer}>
          {gatheringItem.reduceResult.map((item, index) => (
            <GatheringItemLite
              key={index}
              data={item}
              showRightNavIcon
              onPress={onReduceResultItemPress}
            />
          ))}
        </View>
      </List.Section>
    ),
    [gatheringItem.reduceResult, onReduceResultItemPress, theme.colors.primary],
  );
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}>
      {appHeader}
      <View style={styles.infoCard}>
        {infoCardContent}
        <GatheringItemTimerGroup
          startTimeEt={
            parsedGatheringPoints.poppingGatheringPoint.rarePopEvent
              ? parsedGatheringPoints.poppingGatheringPoint.rarePopEvent.startTimeEt.format(
                  'HH:mm',
                )
              : '--:--'
          }
          startTimeLt={
            parsedGatheringPoints.poppingGatheringPoint.rarePopEvent
              ? parsedGatheringPoints.poppingGatheringPoint.rarePopEvent.startTimeLt.format(
                  'HH:mm',
                )
              : '--:--'
          }
          countdownValue={
            getCountdownValueByParsedEvent(
              parsedGatheringPoints.poppingGatheringPoint.rarePopEvent,
              eorzeaTime.currentLt,
            ) ?? '通常'
          }
          countdownActivate={
            parsedGatheringPoints.poppingGatheringPoint.state ===
            GatheringRarePopEventState.OCCURRING
          }
        />
      </View>
      <ScrollView overScrollMode="never">
        <GatheringItemDetail
          gatheringItem={gatheringItem}
          poppingGatheringPoint={parsedGatheringPoints.poppingGatheringPoint}
          footerTip="当前展示的为将出现或出现中的采集信息"
        />
        {showAllItemsOfGatheringPoint ? allGatheringPointItems : null}
        {gatheringItem.isReducible ? allReduceResultItems : null}
        <List.Section style={[styles.listSectionContainer]}>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            全部采集点
          </List.Subheader>
          {parsedGatheringPoints.sortedOccurringGatheringPoints
            .slice(0, gatheringPointGroupItemLimit.occurring)
            .map((point, index) => (
              <GatheringPointSummary
                key={index}
                gatheringPointBaseId={point.gatheringPointBaseId}
                startTimeEt={
                  point.rarePopEvent
                    ? point.rarePopEvent.startTimeEt.format('HH:mm')
                    : null
                }
                startTimeLt={
                  point.rarePopEvent
                    ? point.rarePopEvent.startTimeLt.format('HH:mm')
                    : null
                }
                countdownActivate
                countdownValue={
                  getCountdownValueByParsedEvent(
                    point.rarePopEvent,
                    eorzeaTime.currentLt,
                  ) ?? null
                }
                regionName={getPlaceName(point)}
                prefix={(index + 1).toString()}
                coordinate={`X:${point.x}, Y:${point.y}`}
              />
            ))}
          {parsedGatheringPoints.sortedPreparingGatheringPoints
            .slice(0, gatheringPointGroupItemLimit.preparing)
            .map((point, index) => (
              <GatheringPointSummary
                key={index}
                gatheringPointBaseId={point.gatheringPointBaseId}
                startTimeEt={
                  point.rarePopEvent
                    ? point.rarePopEvent.startTimeEt.format('HH:mm')
                    : null
                }
                startTimeLt={
                  point.rarePopEvent
                    ? point.rarePopEvent.startTimeLt.format('HH:mm')
                    : null
                }
                countdownActivate={false}
                countdownValue={
                  getCountdownValueByParsedEvent(
                    point.rarePopEvent,
                    eorzeaTime.currentLt,
                  ) ?? null
                }
                regionName={getPlaceName(point)}
                prefix={(
                  index +
                  parsedGatheringPoints.sortedOccurringGatheringPoints.length +
                  1
                ).toString()}
                coordinate={`X:${point.x}, Y:${point.y}`}
              />
            ))}
          {gatheringPointAmount > GATHERING_POINT_LIST_MAX_AMOUNT ? (
            <ShowMore
              unfold={isShowAllGatheringPoints}
              onChange={setShowAllGatheringPoints}
            />
          ) : null}
        </List.Section>
        {enableFFCafeMapInDetail ? ffCafeMap : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: px2DpY(22),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(16),
    paddingLeft: px2DpX(24),
    paddingRight: px2DpX(24),
    paddingTop: px2DpY(14),
    paddingBottom: px2DpY(14),
  },
  infoCardContent: {
    justifyContent: 'center',
    gap: px2DpY(5),
    flexGrow: 1,
  },
  infoCardTitle: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(16),
  },
  infoCardDescRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(3),
  },
  starContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardDesc: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(18),
  },
  itemIcon: {
    height: px2DpY(56),
    width: px2DpY(56),
    borderRadius: px2DpY(28),
  },
  listSectionContainer: {
    paddingHorizontal: px2DpX(8),
  },
  listSectionTitleStyle: {
    fontSize: px2DpY(14),
    paddingHorizontal: px2DpX(16),
    paddingVertical: px2DpY(18),
  },
  ffCafeMapContainer: {
    width: px2DpX(310),
    height: px2DpY(230),
    alignSelf: 'center',
    borderRadius: px2DpY(3),
    overflow: 'hidden',
  },
  gatheringItemLiteWrappableContainer: {
    paddingHorizontal: px2DpX(25),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dividerStyle: {
    paddingHorizontal: px2DpX(25),
  },
});

export default Detail;
