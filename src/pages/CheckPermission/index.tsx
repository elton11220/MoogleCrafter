import {useEffect, useMemo} from 'react';
import type {FC} from 'react';
import {
  BackHandler,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {Appbar, Button, List, Text, useTheme} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {useNavigation, useRoute} from '@react-navigation/native';
import Tag from '../../components/Tag';
import {
  openApplicationDetailsSettings,
  openChannelNotificationSettings,
  openIgnoreBatteryOptimizationSettings,
  openScheduleExactAlarmSettings,
} from '../../native/SystemSettings';
import {openNotificationSettings} from '../../native/NotificationManager';
import {RootStackScreenProps} from '../../navigation/types';
import {useStore} from '../../store';

const CheckPermission: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  const {
    params: {preventBack, showDismissButton},
  } = useRoute<RootStackScreenProps<'CheckPermission'>['route']>();
  const updateShowCheckPermissionWhenLaunch = useStore(
    s => s.updateShowCheckPermissionWhenLaunch,
  );
  const pageHeader = useMemo(
    () => (
      <>
        <Appbar.Header mode="center-aligned">
          <Appbar.Content title="检查权限" titleStyle={styles.titleStyle} />
          <Appbar.Action
            icon={({color, size}) => (
              <MaterialIcons name="close" color={color} size={size} />
            )}
            size={px2DpY(24)}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </Appbar.Header>
        <View style={styles.descContainer}>
          <Text
            allowFontScaling={false}
            style={[
              styles.descText,
              {
                color: theme.colors.tertiaryContentText,
              },
            ]}>
            为保证应用功能正常运行，需要您在使用前对某些权限进行配置，请您依次检查并配置以下权限和设置
          </Text>
        </View>
      </>
    ),
    [navigation, theme.colors.tertiaryContentText],
  );
  useEffect(() => {
    const hardwareBackPressListener = BackHandler.addEventListener(
      'hardwareBackPress',
      () => preventBack,
    );
    return () => hardwareBackPressListener.remove();
  }, [preventBack]);
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}>
      {pageHeader}
      <ScrollView>
        <List.Item
          title="闹钟和提醒"
          description="Android 12 系统需要 SCHEDULE_EXACT_ALARM 权限设置精准闹钟（其他版本无需此权限）"
          descriptionStyle={[
            styles.listItemDescStyle,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}
          style={styles.listItemStyle}
          right={() => (
            <View style={[styles.itemRightNavContainer, styles.itemRightPatch]}>
              <MaterialIcons
                name="chevron-right"
                size={px2DpY(20)}
                color={theme.colors.tertiaryContentText}
              />
            </View>
          )}
          onPress={() => {
            openScheduleExactAlarmSettings().catch((e: Error) => {
              ToastAndroid.show(e.message, ToastAndroid.SHORT);
            });
          }}
        />
        <List.Item
          title="允许应用自启动"
          titleStyle={styles.listItemTitleStyle}
          description="确保此项开启，否则某些品牌系统将在切出应用或锁屏时冻结应用，你将无法及时接收通知"
          descriptionStyle={[
            styles.listItemDescStyle,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}
          style={styles.listItemStyle}
          right={() => (
            <View style={[styles.itemRightNavContainer, styles.itemRightPatch]}>
              <MaterialIcons
                name="chevron-right"
                size={px2DpY(20)}
                color={theme.colors.tertiaryContentText}
              />
            </View>
          )}
          onPress={() => openApplicationDetailsSettings()}
        />
        <List.Item
          title="允许唤醒前台及完全后台行为"
          titleStyle={styles.listItemTitleStyle}
          description="确保此项开启，否则某些品牌系统将在切出应用或锁屏时冻结应用，你将无法及时接收通知"
          descriptionStyle={[
            styles.listItemDescStyle,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}
          style={styles.listItemStyle}
          right={() => (
            <View style={[styles.itemRightNavContainer, styles.itemRightPatch]}>
              <MaterialIcons
                name="chevron-right"
                size={px2DpY(20)}
                color={theme.colors.tertiaryContentText}
              />
            </View>
          )}
          onPress={() => openApplicationDetailsSettings()}
        />
        <List.Item
          title="系统通知"
          titleStyle={styles.listItemTitleStyle}
          description="采集事件监控依赖于 Android 前台服务，开启系统通知确保前台服务通知常驻通知中心"
          descriptionStyle={[
            styles.listItemDescStyle,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}
          style={styles.listItemStyle}
          right={() => (
            <View style={[styles.itemRightNavContainer, styles.itemRightPatch]}>
              <MaterialIcons
                name="chevron-right"
                size={px2DpY(20)}
                color={theme.colors.tertiaryContentText}
              />
            </View>
          )}
          onPress={() => openNotificationSettings()}
        />
        <List.Item
          title={
            <View style={styles.listItemTitleRow}>
              <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
                采集事件通知渠道
              </Text>
              <Tag>可选</Tag>
            </View>
          }
          titleStyle={styles.listItemTitleStyle}
          description='若希望在采集事件发生时推送通知，请打开系统通知并开启"采集事件通知"渠道、设置通知方式(铃声、震动、横幅等)'
          descriptionStyle={[
            styles.listItemDescStyle,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}
          style={styles.listItemStyle}
          right={() => (
            <View style={[styles.itemRightNavContainer, styles.itemRightPatch]}>
              <MaterialIcons
                name="chevron-right"
                size={px2DpY(20)}
                color={theme.colors.tertiaryContentText}
              />
            </View>
          )}
          onPress={() => openChannelNotificationSettings()}
        />
        <List.Item
          title={
            <View style={styles.listItemTitleRow}>
              <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
                忽略电池优化
              </Text>
              <Tag>可选</Tag>
            </View>
          }
          titleStyle={styles.listItemTitleStyle}
          description="某些品牌系统在允许自启动、唤醒前台及完全后台行为后仍无法接收通知，此时你可以选择关闭电池优化"
          descriptionStyle={[
            styles.listItemDescStyle,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}
          style={styles.listItemStyle}
          right={() => (
            <View style={[styles.itemRightNavContainer, styles.itemRightPatch]}>
              <MaterialIcons
                name="chevron-right"
                size={px2DpY(20)}
                color={theme.colors.tertiaryContentText}
              />
            </View>
          )}
          onPress={() => openIgnoreBatteryOptimizationSettings()}
        />
        <List.Item
          title={
            <View style={styles.listItemTitleRow}>
              <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
                锁定最近任务
              </Text>
              <Tag>可选</Tag>
            </View>
          }
          titleStyle={styles.listItemTitleStyle}
          description="为防止在清理最近任务时意外地清理本应用，你可以选择在最近任务列表中锁定该应用"
          descriptionStyle={[
            styles.listItemDescStyle,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}
          style={styles.listItemStyle}
          right={() => (
            <View style={[styles.itemRightNavContainer, styles.itemRightPatch]}>
              <MaterialIcons
                name="chevron-right"
                size={px2DpY(20)}
                color={theme.colors.background}
              />
            </View>
          )}
        />
      </ScrollView>
      {showDismissButton ? (
        <View style={styles.footerContainer}>
          <Button
            onPress={() => {
              updateShowCheckPermissionWhenLaunch(false);
              navigation.goBack();
            }}>
            不再提示
          </Button>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: px2DpY(22),
  },
  descContainer: {
    paddingVertical: px2DpY(10),
    paddingHorizontal: px2DpX(15),
  },
  descText: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(28),
  },
  listItemStyle: {
    paddingVertical: px2DpY(6),
  },
  listItemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(5),
  },
  listItemTitleStyle: {
    fontSize: px2DpY(16),
    lineHeight: px2DpY(24),
  },
  listItemDescStyle: {
    fontSize: px2DpY(13),
    lineHeight: px2DpY(20),
    marginRight: px2DpX(10),
  },
  itemRightNavContainer: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemRightPatch: {
    marginRight: -8,
  },
  footerContainer: {
    height: px2DpY(70),
    justifyContent: 'center',
    paddingHorizontal: px2DpX(120),
  },
});

export default CheckPermission;
