import {View, StyleSheet, ScrollView} from 'react-native';
import {useMemo} from 'react';
import type {FC} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Appbar,
  Button,
  List,
  MD3LightTheme,
  Text,
  useTheme,
} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {useRoute} from '@react-navigation/native';
import {extendedDarkColors} from '../../config/themes/extension';
import useEorzeaTimer from '../../hooks/useEorzeaTimer';
import type {RootStackScreenProps} from '../../navigation/types';
import {
  getTimeTableFromGatheringPoints,
  parseGatheringRarePopEvents,
  getPoppingEvent,
  getPoppingGatheringPointByParsedEvents,
  GatheringRarePopEventState,
  getCountdownValueByParsedEvents,
} from '../../utils/eorzeaTime';
import FastImage from 'react-native-fast-image';
import {GatheringTypes} from '../../utils/eorzeaConstant';
import {itemIcons} from '../../images/gameResource';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GatheringItemDetail from '../../components/GatheringItemDetail';
import GatheringItemTimerGroup from '../../components/GatheringItemTimerGroup';
import WebView from 'react-native-webview';
import {generalSettingsSelector, useStore} from '../../store';

const FullScreenReminder: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const {
    params: {gatheringItem},
  } = useRoute<RootStackScreenProps<'Detail'>['route']>();
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
  const generalSettings = useStore(generalSettingsSelector);
  const appBarHeader = useMemo(
    () => (
      <Appbar.Header style={{backgroundColor: 'transparent'}}>
        <Appbar.Content
          title="素材已出现"
          titleStyle={styles.titleStyle}
          color={extendedDarkColors.primaryContentText}
        />
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
          <Text allowFontScaling={false} style={styles.infoCardTitle}>
            {gatheringItem.name}
          </Text>
          <View style={styles.infoCardDescRow}>
            <Text allowFontScaling={false} style={styles.infoCardDesc}>
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
    theme.colors.tertiaryContentText,
  ]);
  const ffCafeMap = useMemo(
    () =>
      generalSettings.enableFFCafeMapInFullScreen ? (
        <List.Section
          style={[styles.listSectionContainer, {height: px2DpY(310)}]}>
          <List.Subheader style={styles.listSectionTitleStyle}>
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
      ) : null,
    [
      gatheringPointDetail.mapId,
      gatheringPointDetail.x,
      gatheringPointDetail.y,
      generalSettings.enableFFCafeMapInFullScreen,
    ],
  );
  const footer = useMemo(
    () => (
      <View style={styles.footer}>
        <Button
          style={styles.footerButton}
          mode="contained"
          theme={{
            colors: {
              primary: MD3LightTheme.colors.primary,
            },
          }}
          textColor={MD3LightTheme.colors.onPrimary}
          labelStyle={{fontSize: px2DpY(14), lineHeight: px2DpY(18)}}
          onPress={() => {}}>
          知道了
        </Button>
      </View>
    ),
    [],
  );
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: 'rgba(0,0,0,.8)',
      }}>
      {appBarHeader}
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
          theme="dark"
        />
      </View>
      <ScrollView>
        <GatheringItemDetail
          gatheringItem={gatheringItem}
          poppingGatheringPoint={gatheringPointDetail}
          theme="dark"
        />
        {ffCafeMap}
      </ScrollView>
      {footer}
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
    color: extendedDarkColors.primaryContentText,
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
    color: extendedDarkColors.tertiaryContentText,
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
    color: '#d8d8d8',
  },
  ffCafeMapContainer: {
    width: px2DpX(310),
    height: px2DpY(230),
    alignSelf: 'center',
    borderRadius: px2DpY(3),
    overflow: 'hidden',
  },
  footer: {
    paddingBottom: px2DpY(50),
    paddingTop: px2DpY(20),
    alignItems: 'center',
  },
  footerButton: {
    width: px2DpX(150),
    height: px2DpY(40),
  },
});

export default FullScreenReminder;
