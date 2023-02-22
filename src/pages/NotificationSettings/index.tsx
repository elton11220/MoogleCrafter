import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  Appbar,
  List,
  RadioButton,
  Switch,
  Text,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Tip from '../../components/Tip';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import SoundChips from '../../components/SoundChips';
import {notificationSettingsSelector, useStore} from '../../store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NotificationSettings = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  const {enableRingtone, enableVibration, enableFullScreen, inAppRingtoneType} =
    useStore(notificationSettingsSelector);
  const updateNotificationSettings = useStore(
    s => s.updateNotificationSettings,
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
          <List.Item
            title={
              <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
                响铃提醒
              </Text>
            }
            right={() => (
              <Switch
                value={enableRingtone}
                onValueChange={value =>
                  updateNotificationSettings('enableRingtone', value)
                }
                style={styles.itemRightPatch}
              />
            )}
          />
          <List.Item
            title={
              <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
                震动提醒
              </Text>
            }
            right={() => (
              <Switch
                value={enableVibration}
                onValueChange={value =>
                  updateNotificationSettings('enableVibration', value)
                }
                style={styles.itemRightPatch}
              />
            )}
          />
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
              <View
                style={[styles.itemRightNavContainer, styles.itemRightPatch]}>
                <Text
                  style={[
                    styles.itemRightNavText,
                    {color: theme.colors.tertiaryContentText},
                  ]}
                  allowFontScaling={false}>
                  已开启
                </Text>
                <MaterialIcons
                  name="chevron-right"
                  size={px2DpY(20)}
                  color={theme.colors.tertiaryContentText}
                />
              </View>
            )}
            onPress={() => {}}
          />
        </List.Section>
        <List.Section>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            应用内提示音
          </List.Subheader>
          <RadioButton.Group
            value={inAppRingtoneType}
            onValueChange={value =>
              updateNotificationSettings(
                'inAppRingtoneType',
                value as ZustandStore.InAppRingtoneType,
              )
            }>
            <RadioButton.Item
              labelStyle={styles.listItemTitleStyle}
              label="简易提示音"
              value="simple"
            />
            <RadioButton.Item
              labelStyle={styles.listItemTitleStyle}
              label="TTS 语音合成"
              value="tts"
            />
            <RadioButton.Item
              labelStyle={styles.listItemTitleStyle}
              label="素材版本主题提示音"
              value="exVersion"
            />
          </RadioButton.Group>
          <View style={{paddingTop: px2DpY(5)}}>
            <Tip title="将根据出现的素材对应版本播放不同提示音" />
            <View style={styles.chipsContainer}>
              <View style={styles.chipsRow}>
                <SoundChips title="2.0 提示音" />
                <SoundChips title="3.0 提示音" />
              </View>
              <View style={styles.chipsRow}>
                <SoundChips title="4.0 提示音" />
                <SoundChips title="5.0 提示音" />
              </View>
              <View style={[styles.chipsRow, {width: px2DpX(120)}]}>
                <SoundChips title="6.0 提示音" />
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
});

export default NotificationSettings;
