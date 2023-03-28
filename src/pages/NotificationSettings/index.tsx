import {useNavigation} from '@react-navigation/native';
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
import {useCallback, useEffect, useMemo, useState} from 'react';
import {
  openNotificationSettings,
  getNotificationsEnabledStatus,
} from '../../native/NotificationManager';
import type {NotificationManagerModule} from '../../native/NotificationManager/typings';
import {ExVersion} from '../../utils/eorzeaConstant';
import {
  NotificationMode,
  playSimpleSound,
  setNotificationMode,
} from '../../native/SpecialRingtone';
import Tip from '../../components/Tip';

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
        playSimpleSound().then();
        setNotificationMode(NotificationMode.SIMPLE);
      } else if (value === 'tts') {
        setNotificationMode(NotificationMode.TTS);
      } else if (value === 'exVersion') {
        setNotificationMode(NotificationMode.EORZEA_THEME);
      }
      updateNotificationSettings('specialRingtoneType', value);
    },
    [updateNotificationSettings],
  );
  useEffect(() => {
    updateNotificationEnabledState();
    const onResumeEventSubscription = DeviceEventEmitter.addListener(
      'onActivityResume',
      updateNotificationEnabledState,
    );
    return () => onResumeEventSubscription.remove();
  }, [updateNotificationEnabledState]);
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
          title={
            <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
              全屏提醒
            </Text>
          }
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
      theme.colors.tertiaryContentText,
      updateNotificationSettings,
    ],
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
          title="TTS 语音合成"
          description="使用系统TTS引擎播报出现的素材简介"
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
              <RadioButton value="tts" disabled={!enableSpecialRingtone} />
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
      updateSpecialRingtone,
    ],
  );
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
