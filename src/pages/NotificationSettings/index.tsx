import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {
  View,
  StyleSheet,
  ScrollView,
  DeviceEventEmitter,
  ToastAndroid,
} from 'react-native';
import {
  Appbar,
  List,
  RadioButton,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import SoundChips from '../../components/SoundChips';
import {notificationSettingsSelector, useStore} from '../../store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  openNotificationSettings,
  getNotificationsEnabledStatus,
} from '../../native/NotificationManager';
import type {NotificationManagerModule} from '../../native/NotificationManager/typings';
import {ExVersion} from '../../utils/eorzeaConstant';
import {
  getTTSStatus,
  NotificationMode,
  playSimpleSound,
  setNotificationMode,
  speakWithTTS,
  TTSStatus,
} from '../../native/SpecialRingtone';
import Tip from '../../components/Tip';
import Tag from '../../components/Tag';
import {onPageStart, onPageEnd} from '../../native/BaiduMobStat';

const getNotificationMode = (
  specialRingtoneType: ZustandStore.SpecialRingtoneType,
) => {
  if (specialRingtoneType === 'simple') {
    return NotificationMode.SIMPLE;
  } else if (specialRingtoneType === 'tts') {
    return NotificationMode.TTS;
  } else if (specialRingtoneType === 'exVersion') {
    return NotificationMode.EORZEA_THEME;
  } else {
    return NotificationMode.OFF;
  }
};

const NotificationSettings = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  const {enableSpecialRingtone, enableFullScreen, specialRingtoneType} =
    useStore(notificationSettingsSelector);
  const updateNotificationSettings = useStore(
    s => s.updateNotificationSettings,
  );
  const [notificationsEnabledState, setNotificationsEnabledState] =
    useState<NotificationManagerModule.NotificationsEnabledStatus>({
      areNotificationsEnabled: false,
      isENChannelEnabled: false,
      isENSChannelEnabled: true,
    });
  const isSystemNotificationEnabled = useMemo(() => {
    if (notificationsEnabledState.isENSChannelEnabled === false) {
      ToastAndroid.show(
        '采集事件监控服务通知渠道已关闭，可能导致服务异常',
        ToastAndroid.LONG,
      );
    }
    return notificationsEnabledState.areNotificationsEnabled
      ? notificationsEnabledState.isENChannelEnabled
      : notificationsEnabledState.areNotificationsEnabled;
  }, [
    notificationsEnabledState.areNotificationsEnabled,
    notificationsEnabledState.isENChannelEnabled,
    notificationsEnabledState.isENSChannelEnabled,
  ]);
  const updateNotificationEnabledState = useCallback(() => {
    getNotificationsEnabledStatus().then(value =>
      setNotificationsEnabledState(value),
    );
  }, []);
  const updateSpecialRingtone = useCallback(
    (value: ZustandStore.NotificationSettings['specialRingtoneType']) => {
      if (value === 'simple') {
        playSimpleSound()
          .then()
          .catch(() => {
            ToastAndroid.show('播放失败', ToastAndroid.SHORT);
          });
        setNotificationMode(NotificationMode.SIMPLE);
      } else if (value === 'tts') {
        speakWithTTS('90级 加雷马 不定性铁陨石')
          .then()
          .catch(() => {
            ToastAndroid.show('播放失败', ToastAndroid.SHORT);
          });
        setNotificationMode(NotificationMode.TTS);
      } else if (value === 'exVersion') {
        setNotificationMode(NotificationMode.EORZEA_THEME);
      }
      updateNotificationSettings('specialRingtoneType', value);
    },
    [updateNotificationSettings],
  );
  const [ttsStatus, setTTSStatus] = useState<TTSStatus>(
    TTSStatus.UNINITIALIZED,
  );
  const ttsStatusTag = useMemo(() => {
    if (ttsStatus === TTSStatus.UNINITIALIZED) {
      return <Tag color="#fa8c16">未初始化</Tag>;
    } else if (ttsStatus === TTSStatus.WORKING) {
      return <Tag color="#52C41A">正常</Tag>;
    } else if (ttsStatus === TTSStatus.LANG_NOT_SUPPORT) {
      return <Tag color="#CF1322">不支持中文</Tag>;
    } else if (ttsStatus === TTSStatus.FAILED) {
      return <Tag color="#CF1322">初始化失败</Tag>;
    } else {
      return <Tag color="#fa8c16">未知状态</Tag>;
    }
  }, [ttsStatus]);
  const updateTTSEngineState = useCallback(() => {
    getTTSStatus().then(value => setTTSStatus(value));
  }, []);
  useEffect(() => {
    const onResumeEventSubscription = DeviceEventEmitter.addListener(
      'onActivityResume',
      () => {
        updateNotificationEnabledState();
        updateTTSEngineState();
      },
    );
    return () => onResumeEventSubscription.remove();
  }, [updateNotificationEnabledState, updateTTSEngineState]);
  useLayoutEffect(() => {
    updateNotificationEnabledState();
    updateTTSEngineState();
  }, [updateNotificationEnabledState, updateTTSEngineState]);
  const specialRingtoneListItemEl = useMemo(
    () => (
      <List.Item
        title={
          <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
            特殊提示音
          </Text>
        }
        right={() => (
          <Switch
            value={enableSpecialRingtone}
            onValueChange={value => {
              updateNotificationSettings('enableSpecialRingtone', value);
              setNotificationMode(
                value
                  ? getNotificationMode(specialRingtoneType)
                  : NotificationMode.OFF,
              );
            }}
            style={styles.itemRightPatch}
          />
        )}
      />
    ),
    [enableSpecialRingtone, specialRingtoneType, updateNotificationSettings],
  );
  const notificationTypeEl = useMemo(
    () => (
      <>
        <List.Item
          title="全屏提醒"
          titleStyle={styles.listItemTitleStyle}
          description="这个功能需要完善，请等待更新"
          descriptionStyle={[
            styles.listItemDescStyle,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}
          right={() => (
            <Switch
              value={enableFullScreen}
              onValueChange={value =>
                updateNotificationSettings('enableFullScreen', value)
              }
              style={styles.itemRightPatch}
            />
          )}
        />
        <List.Item
          title={
            <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
              系统消息通知
            </Text>
          }
          right={() => (
            <View style={[styles.itemRightNavContainer, styles.itemRightPatch]}>
              <Text
                style={[
                  styles.itemRightNavText,
                  {color: theme.colors.tertiaryContentText},
                ]}
                allowFontScaling={false}>
                {isSystemNotificationEnabled ? '已开启' : '未开启'}
              </Text>
              <MaterialIcons
                name="chevron-right"
                size={px2DpY(20)}
                color={theme.colors.tertiaryContentText}
              />
            </View>
          )}
          onPress={() => openNotificationSettings()}
        />
      </>
    ),
    [
      enableFullScreen,
      isSystemNotificationEnabled,
      theme.colors.secondaryContentText,
      theme.colors.tertiaryContentText,
      updateNotificationSettings,
    ],
  );
  const notificationIssueHelperEl = useMemo(
    () => (
      <List.Section>
        <List.Subheader
          style={[styles.listSectionTitleStyle, {color: theme.colors.primary}]}>
          提醒无法正常工作？
        </List.Subheader>
        <List.Item
          title="检查应用权限"
          titleStyle={styles.listItemTitleStyle}
          onPress={() => {
            navigation.navigate('CheckPermission', {
              preventBack: false,
              showDismissButton: false,
            });
          }}
        />
      </List.Section>
    ),
    [navigation, theme.colors.primary],
  );
  const specialRingtoneTypeEl = useMemo(
    () => (
      <RadioButton.Group
        value={specialRingtoneType}
        onValueChange={value =>
          updateSpecialRingtone(value as ZustandStore.SpecialRingtoneType)
        }>
        <List.Item
          title="简易提示音"
          description="一个简单的提示音"
          titleStyle={styles.listItemTitleStyle}
          disabled={!enableSpecialRingtone}
          descriptionStyle={[
            styles.listItemDescStyle,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}
          style={styles.complexListItemStyle}
          right={() => (
            <View style={[styles.itemRightPatch, styles.itemRightContainer]}>
              <RadioButton value="simple" disabled={!enableSpecialRingtone} />
            </View>
          )}
          onPress={() => updateSpecialRingtone('simple')}
        />
        <List.Item
          title={
            <View style={styles.listItemContainer}>
              <Text
                style={[styles.listItemTitleStyle, {lineHeight: px2DpY(20)}]}
                allowFontScaling={false}>
                TTS语音合成
              </Text>
              {ttsStatusTag}
            </View>
          }
          description="使用系统TTS引擎播报出现的素材简介"
          titleStyle={styles.listItemTitleStyle}
          disabled={!enableSpecialRingtone || ttsStatus !== TTSStatus.WORKING}
          descriptionStyle={[
            styles.listItemDescStyle,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}
          style={styles.complexListItemStyle}
          right={() => (
            <View style={[styles.itemRightPatch, styles.itemRightContainer]}>
              <RadioButton
                value="tts"
                disabled={
                  !enableSpecialRingtone || ttsStatus !== TTSStatus.WORKING
                }
              />
            </View>
          )}
          onPress={() => updateSpecialRingtone('tts')}
        />
        <List.Item
          title="素材版本主题提示音"
          description="播放本次事件出现最多项的版本的主题音效"
          titleStyle={styles.listItemTitleStyle}
          disabled={!enableSpecialRingtone}
          descriptionStyle={[
            styles.listItemDescStyle,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}
          style={styles.complexListItemStyle}
          right={() => (
            <View style={[styles.itemRightPatch, styles.itemRightContainer]}>
              <RadioButton
                value="exVersion"
                disabled={!enableSpecialRingtone}
              />
            </View>
          )}
          onPress={() => updateSpecialRingtone('exVersion')}
        />
      </RadioButton.Group>
    ),
    [
      enableSpecialRingtone,
      specialRingtoneType,
      theme.colors.secondaryContentText,
      ttsStatus,
      ttsStatusTag,
      updateSpecialRingtone,
    ],
  );
  const onPageFocusChanged = useCallback(() => {
    onPageStart('NotificationSettings');
    return () => {
      onPageEnd('NotificationSettings');
    };
  }, []);
  useFocusEffect(onPageFocusChanged);
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}>
      <Appbar.Header>
        <Appbar.BackAction
          rippleColor={theme.colors.rippleBackgroundColor}
          onPress={() => {
            navigation.goBack();
          }}
          size={px2DpY(24)}
        />
        <Appbar.Content title="通知设置" titleStyle={styles.titleStyle} />
      </Appbar.Header>
      <ScrollView>
        <List.Section>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            通知类型
          </List.Subheader>
          {specialRingtoneListItemEl}
          {notificationTypeEl}
        </List.Section>
        {notificationIssueHelperEl}
        <List.Section>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            特殊提示音类型
          </List.Subheader>
          {specialRingtoneTypeEl}
          <View style={{paddingTop: px2DpY(5)}}>
            <Tip title="关闭通知音量或静音可能导致您错过提醒" />
            <View style={styles.chipsContainer}>
              <View style={styles.chipsRow}>
                <SoundChips
                  title="2.0 提示音"
                  exVersion={ExVersion.REALM_REBORN}
                />
                <SoundChips
                  title="3.0 提示音"
                  exVersion={ExVersion.HEAVEN_SWARD}
                />
              </View>
              <View style={styles.chipsRow}>
                <SoundChips
                  title="4.0 提示音"
                  exVersion={ExVersion.STORM_BLOOD}
                />
                <SoundChips
                  title="5.0 提示音"
                  exVersion={ExVersion.SHADOW_BRINGERS}
                />
              </View>
              <View style={[styles.chipsRow, {width: px2DpX(120)}]}>
                <SoundChips
                  title="6.0 提示音"
                  exVersion={ExVersion.END_WALKER}
                />
              </View>
            </View>
          </View>
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: px2DpY(22),
  },
  listSectionTitleStyle: {
    fontSize: px2DpY(14),
  },
  listItemTitleStyle: {
    fontSize: px2DpY(16),
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(10),
  },
  listItemDescStyle: {
    fontSize: px2DpY(13),
    lineHeight: px2DpY(20),
    paddingTop: px2DpY(2),
  },
  complexListItemStyle: {
    paddingVertical: px2DpY(4),
  },
  chipsContainer: {
    paddingTop: px2DpY(10),
    gap: px2DpX(10),
    alignItems: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: px2DpX(10),
    width: px2DpX(240),
  },
  itemRightNavContainer: {
    height: px2DpY(32),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRightNavText: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(17),
  },
  itemRightPatch: {
    marginRight: -8,
  },
  itemRightContainer: {
    justifyContent: 'center',
  },
});

export default NotificationSettings;
