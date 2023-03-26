import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Appbar, List, Switch, Text, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import ColorPicker from '../../components/ColorPicker';
import {themeSettingsSelector, useStore} from '../../store';

const colorList: ColorPicker.ColorList = [
  {
    key: 'purple',
    value: '#6750a4',
  },
  {
    key: 'blue',
    value: '#315da8',
  },
  {
    key: 'green',
    value: '#00b68a',
  },
  {
    key: 'pink',
    value: '#ff74a7',
  },
  {
    key: 'yellow',
    value: '#f2cc00',
  },
  {
    key: 'cyan',
    value: '#0a6873',
  },
];

const ThemeSettings = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  const {themeColor, darkModeFollowOS, enableDarkMode} = useStore(
    themeSettingsSelector,
  );
  const updateThemeSettings = useStore(s => s.updateThemeSettings);
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
        <Appbar.Content title="主题设置" titleStyle={styles.titleStyle} />
      </Appbar.Header>
      <ScrollView>
        <List.Section>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            主题颜色
          </List.Subheader>
          <View style={styles.colorPickerItem}>
            <ColorPicker
              colorList={colorList}
              value={themeColor}
              setValue={value => updateThemeSettings('themeColor', value)}
            />
          </View>
        </List.Section>
        <List.Section>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            暗黑模式
          </List.Subheader>
          <List.Item
            title={
              <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
                跟随系统
              </Text>
            }
            right={() => (
              <Switch
                value={darkModeFollowOS}
                onValueChange={value =>
                  updateThemeSettings('darkModeFollowOS', value)
                }
                style={styles.itemRightPatch}
              />
            )}
          />
          <List.Item
            title={
              <Text style={styles.listItemTitleStyle} allowFontScaling={false}>
                开启暗黑模式
              </Text>
            }
            right={() => (
              <Switch
                value={enableDarkMode}
                onValueChange={value =>
                  updateThemeSettings('enableDarkMode', value)
                }
                disabled={darkModeFollowOS}
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
  colorPickerItem: {
    paddingLeft: px2DpX(15),
    paddingRight: px2DpX(15),
  },
  itemRightPatch: {
    marginRight: -8,
  },
});

export default ThemeSettings;
