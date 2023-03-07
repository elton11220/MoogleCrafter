import {View, StyleSheet, ScrollView} from 'react-native';
import {FC, useMemo} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Appbar, List, Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import type {RootStackScreenProps} from '../../navigation/types';
import {
  parseGatheringRarePopEvents,
  getPoppingEvent,
  getPoppingGatheringPointByParsedEvents,
  getTimeTableFromGatheringPoints,
  getCountdownValueByParsedEvents,
  GatheringRarePopEventState,
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

const Detail: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const {
    params: {gatheringItem},
  } = useRoute<RootStackScreenProps<'Detail'>['route']>();
  const navigation = useNavigation();
  const timeTable = useMemo(
    () => getTimeTableFromGatheringPoints(gatheringItem.gatheringPoints),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  const eorzeaTime = useEorzeaTimer();
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
              {`${GatheringTypes[gatheringPointDetail.gatheringType]} | ${
                gatheringItem.gatheringItemLevel
              }`}
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
    gatheringPointDetail.gatheringType,
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
              uri: `https://map.wakingsands.com/#f=mark&id=${gatheringPointDetail.mapId}&x=${gatheringPointDetail.x}&y=${gatheringPointDetail.y}`,
            }}
            scrollEnabled={false}
            overScrollMode="never"
            startInLoadingState
            cacheMode="LOAD_CACHE_ELSE_NETWORK"
          />
        </View>
      </List.Section>
    ),
    [
      gatheringPointDetail.mapId,
      gatheringPointDetail.x,
      gatheringPointDetail.y,
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
          startTimeEt={eventInfo.startTimeEt}
          startTimeLt={eventInfo.startTimeLt}
          countdownValue={
            getCountdownValueByParsedEvents(
              parsedGatheringRarePopEvents,
              eorzeaTime.currentLt,
            ) ?? '通常'
          }
          countdownActivate={
            eventInfo.state === GatheringRarePopEventState.OCCURRING
          }
        />
      </View>
      <ScrollView>
        <GatheringItemDetail
          gatheringItem={gatheringItem}
          poppingGatheringPoint={gatheringPointDetail}
          footerTip="当前展示的为将出现或出现中的采集信息"
        />
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
