import {useNavigation} from '@react-navigation/native';
import {useMemo, useRef, useState} from 'react';
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
import ConfirmDialog from '../../components/ConfirmDialog';
import type {ConfirmDialogInstance} from '../../components/ConfirmDialog';
import Tag from '../../components/Tag';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {generalSettingsSelector, useStore} from '../../store';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';

const GeneralSettings = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  const {
    enableEorzeaTimeDisplayer,
    placeNameDispMode,
    enableFFCafeMapInDetail,
    showAllItemsOfGatheringPoint,
    enableFFCafeMapInFullScreen,
  } = useStore(generalSettingsSelector);
  const updateGeneralSettings = useStore(s => s.updateGeneralSettings);
  const placeNameDispModeDialogInstance = useRef<ConfirmDialogInstance | null>(
    null,
  );
  const [placeNameDispModeDialogValue, setPlaceNameDispModeDialogValue] =
    useState<ZustandStore.PlaceNameDispMode>(placeNameDispMode);
  const onPlaceNameDispModeDialogConfirm = () => {
    updateGeneralSettings('placeNameDispMode', placeNameDispModeDialogValue);
    if (placeNameDispModeDialogInstance.current) {
      placeNameDispModeDialogInstance.current.hide();
    }
  };
  const placeNameDispModeLabel = useMemo(() => {
    if (placeNameDispMode === 'm') {
      return '地图名';
    } else if (placeNameDispMode === 'a') {
      return '传送点';
    } else if (placeNameDispMode === 'ma') {
      return '地图名 / 传送点';
    } else if (placeNameDispMode === 'am') {
      return '传送点 / 地图名';
    } else {
      return '未指定';
    }
  }, [placeNameDispMode]);
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}>
      <ConfirmDialog
        ref={placeNameDispModeDialogInstance}
        title="显示方式"
        dismissable
        showCancel={false}
        onConfirm={onPlaceNameDispModeDialogConfirm}
        content={
          <RadioButton.Group
            value={placeNameDispModeDialogValue}
            onValueChange={
              setPlaceNameDispModeDialogValue as (value: string) => void
            }>
            <List.Item
              title="地图名"
              description="例：迷津"
              titleStyle={styles.listItemTitleStyle}
              descriptionStyle={[
                styles.listItemDescStyle,
                {
                  color: theme.colors.secondaryContentText,
                },
              ]}
              style={styles.complexListItemStyle}
              left={() => (
                <View style={[styles.itemLeftPatch, styles.itemRightContainer]}>
                  <RadioButton value="m" />
                </View>
              )}
              onPress={() => setPlaceNameDispModeDialogValue('m')}
            />
            <List.Item
              title="传送点"
              description="例：公堂保管院"
              titleStyle={styles.listItemTitleStyle}
              descriptionStyle={[
                styles.listItemDescStyle,
                {
                  color: theme.colors.secondaryContentText,
                },
              ]}
              style={styles.complexListItemStyle}
              left={() => (
                <View style={[styles.itemLeftPatch, styles.itemRightContainer]}>
                  <RadioButton value="a" />
                </View>
              )}
              onPress={() => setPlaceNameDispModeDialogValue('a')}
            />
            <List.Item
              title="地图名 / 传送点"
              description="例：迷津 / 公堂保管院"
              titleStyle={styles.listItemTitleStyle}
              descriptionStyle={[
                styles.listItemDescStyle,
                {
                  color: theme.colors.secondaryContentText,
                },
              ]}
              style={styles.complexListItemStyle}
              left={() => (
                <View style={[styles.itemLeftPatch, styles.itemRightContainer]}>
                  <RadioButton value="ma" />
                </View>
              )}
              onPress={() => setPlaceNameDispModeDialogValue('ma')}
            />
            <List.Item
              title="传送点 / 地图名"
              description="例：公堂保管院 / 迷津"
              titleStyle={styles.listItemTitleStyle}
              descriptionStyle={[
                styles.listItemDescStyle,
                {
                  color: theme.colors.secondaryContentText,
                },
              ]}
              style={styles.complexListItemStyle}
              left={() => (
                <View style={[styles.itemLeftPatch, styles.itemRightContainer]}>
                  <RadioButton value="am" />
                </View>
              )}
              onPress={() => setPlaceNameDispModeDialogValue('am')}
            />
          </RadioButton.Group>
        }
      />
      <Appbar.Header>
        <Appbar.BackAction
          rippleColor={theme.colors.rippleBackgroundColor}
          onPress={() => {
            navigation.goBack();
          }}
          size={px2DpY(24)}
        />
        <Appbar.Content title="更多设置" titleStyle={styles.titleStyle} />
      </Appbar.Header>
      <ScrollView>
        <List.Section>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            功能
          </List.Subheader>
          <List.Item
            title={
              <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
                标题栏显示艾欧泽亚时间
              </Text>
            }
            right={() => (
              <Switch
                value={enableEorzeaTimeDisplayer}
                onValueChange={value =>
                  updateGeneralSettings('enableEorzeaTimeDisplayer', value)
                }
                style={styles.itemRightPatch}
              />
            )}
          />
          <List.Item
            title="采集地点名显示方式"
            titleStyle={styles.listItemTitleStyle}
            onPress={() => {
              if (placeNameDispModeDialogInstance.current) {
                placeNameDispModeDialogInstance.current.show();
              }
            }}
            right={({style: innerStyle}) => (
              <View style={[innerStyle, styles.itemRightPatch]}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.listItemRightTitleStyle,
                    {
                      color: theme.colors.tertiaryContentText,
                    },
                  ]}>
                  {placeNameDispModeLabel}
                </Text>
              </View>
            )}
          />
        </List.Section>
        <List.Section>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            素材详情
          </List.Subheader>
          <List.Item
            title={
              <View style={styles.listItemContainer}>
                <Text
                  style={[styles.listItemTitleStyle, {lineHeight: px2DpY(20)}]}
                  allowFontScaling={false}>
                  肥肥咖啡交互地图
                </Text>
                <Tag>FFCafe</Tag>
              </View>
            }
            right={() => (
              <Switch
                value={enableFFCafeMapInDetail}
                onValueChange={value =>
                  updateGeneralSettings('enableFFCafeMapInDetail', value)
                }
                style={styles.itemRightPatch}
              />
            )}
          />
          <List.Item
            title={
              <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
                显示当前采集点所有物品
              </Text>
            }
            right={() => (
              <Switch
                value={showAllItemsOfGatheringPoint}
                onValueChange={value =>
                  updateGeneralSettings('showAllItemsOfGatheringPoint', value)
                }
                style={styles.itemRightPatch}
              />
            )}
          />
        </List.Section>
        <List.Section>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            全屏提醒
          </List.Subheader>
          <List.Item
            title={
              <View style={styles.listItemContainer}>
                <Text
                  style={[styles.listItemTitleStyle, {lineHeight: px2DpY(20)}]}
                  allowFontScaling={false}>
                  肥肥咖啡交互地图
                </Text>
                <Tag>FFCafe</Tag>
              </View>
            }
            right={() => (
              <Switch
                value={enableFFCafeMapInFullScreen}
                onValueChange={value =>
                  updateGeneralSettings('enableFFCafeMapInFullScreen', value)
                }
                style={styles.itemRightPatch}
              />
            )}
          />
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
  listItemRightTitleStyle: {
    fontSize: px2DpY(14),
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(10),
  },
  itemRightPatch: {
    marginRight: -8,
  },
  itemLeftPatch: {
    marginLeft: px2DpX(15),
  },
  listItemDescStyle: {
    fontSize: px2DpY(13),
    lineHeight: px2DpY(20),
    paddingTop: px2DpY(2),
  },
  itemRightContainer: {
    justifyContent: 'center',
  },
  complexListItemStyle: {
    paddingVertical: px2DpY(4),
  },
});

export default GeneralSettings;
