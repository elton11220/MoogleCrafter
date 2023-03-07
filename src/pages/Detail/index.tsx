import {View, StyleSheet, ScrollView} from 'react-native';
import {useMemo} from 'react';
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

const Detail: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const {
    params: {gatheringItem},
  } = useRoute<RootStackScreenProps<'Detail'>['route']>();
  const navigation = useNavigation();
  const eorzeaTime = useEorzeaTimer();
  const parsedGatheringPoints = parseGatheringPoints(
    gatheringItem.gatheringPoints,
    eorzeaTime.currentEt,
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
      </Appbar.Header>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme.colors.rippleBackgroundColor],
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
          </View>
        </View>
      </>
    );
  }, [
    gatheringItem.gatheringItemLevel,
    gatheringItem.gatheringItemStars,
    gatheringItem.icon,
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
          采集位置
        </List.Subheader>
        <View style={styles.ffCafeMapContainer}>
          <WebView
            source={{
              uri: `https://map.wakingsands.com/#f=mark&id=${parsedGatheringPoints.poppingGatheringPoint.mapId}&x=${parsedGatheringPoints.poppingGatheringPoint.x}&y=${parsedGatheringPoints.poppingGatheringPoint.y}`,
            }}
            scrollEnabled={false}
            startInLoadingState
            cacheMode="LOAD_CACHE_ELSE_NETWORK"
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
        <List.Section style={[styles.listSectionContainer]}>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            全部采集点
          </List.Subheader>
          {parsedGatheringPoints.sortedOccurringGatheringPoints.map(
            (point, index) => (
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
                regionName={point.placeName}
                prefix={(index + 1).toString()}
                coordinate={`X:${point.x}, Y:${point.y}`}
              />
            ),
          )}
          {parsedGatheringPoints.sortedPreparingGatheringPoints.map(
            (point, index) => (
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
                regionName={point.placeName}
                prefix={(
                  index +
                  parsedGatheringPoints.sortedOccurringGatheringPoints.length +
                  1
                ).toString()}
                coordinate={`X:${point.x}, Y:${point.y}`}
              />
            ),
          )}
        </List.Section>
        {ffCafeMap}
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
    paddingVertical: px2DpY(10),
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
});

export default Detail;
