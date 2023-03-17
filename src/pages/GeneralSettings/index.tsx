import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Appbar, List, Switch, Text, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {generalSettingsSelector, useStore} from '../../store';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';

const GeneralSettings = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  const {
    enableEorzeaTimeDisplayer,
    enableFFCafeMapInDetail,
    showAllItemsOfGatheringPoint,
    enableFFCafeMapInFullScreen,
  } = useStore(generalSettingsSelector);
  const updateGeneralSettings = useStore(s => s.updateGeneralSettings);
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
                <View
                  style={[
                    styles.ffCafeTagContainer,
                    {borderColor: theme.colors.tertiaryContentText},
                  ]}>
                  <Text
                    style={[
                      styles.ffCafeTag,
                      {color: theme.colors.tertiaryContentText},
                    ]}
                    allowFontScaling={false}>
                    FFCafe
                  </Text>
                </View>
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
                <View
                  style={[
                    styles.ffCafeTagContainer,
                    {borderColor: theme.colors.tertiaryContentText},
                  ]}>
                  <Text
                    style={[
                      styles.ffCafeTag,
                      {color: theme.colors.tertiaryContentText},
                    ]}
                    allowFontScaling={false}>
                    FFCafe
                  </Text>
                </View>
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
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(10),
  },
  ffCafeTagContainer: {
    paddingLeft: px2DpX(5),
    paddingRight: px2DpX(5),
    borderWidth: 1,
    borderRadius: px2DpY(5),
  },
  ffCafeTag: {
    fontSize: px2DpY(12),
    lineHeight: px2DpY(18),
  },
  itemRightPatch: {
    marginRight: -8,
  },
});

export default GeneralSettings;
