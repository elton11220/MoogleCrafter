import {FC} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Appbar, List, Text, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {useNavigation} from '@react-navigation/native';

const Settings: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}>
      <Appbar.Header>
        <Appbar.Content title="设置" />
      </Appbar.Header>
      <ScrollView
        contentContainerStyle={styles.listScrollViewContentContainerStyle}>
        <List.Section>
          <List.Item
            onPress={() => {
              navigation.navigate('NotificationSettings');
            }}
            title={
              <Text style={styles.listItemTitle} allowFontScaling={false}>
                通知设置
              </Text>
            }
            style={styles.listItem}
            left={() => (
              <MaterialIcons
                name="notifications-none"
                size={px2DpY(24)}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            onPress={() => {
              navigation.navigate('ThemeSettings');
            }}
            title={
              <Text style={styles.listItemTitle} allowFontScaling={false}>
                主题设置
              </Text>
            }
            style={styles.listItem}
            left={() => (
              <MaterialIcons
                name="palette"
                size={px2DpY(24)}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            onPress={() => {
              navigation.navigate('LanguageSettings');
            }}
            title={
              <Text style={styles.listItemTitle} allowFontScaling={false}>
                语言设置 / Language Settings
              </Text>
            }
            style={styles.listItem}
            left={() => (
              <MaterialIcons
                name="language"
                size={px2DpY(24)}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            onPress={() => {
              navigation.navigate('GeneralSettings');
            }}
            title={
              <Text style={styles.listItemTitle} allowFontScaling={false}>
                更多设置
              </Text>
            }
            style={styles.listItem}
            left={() => (
              <Ionicons
                name="build"
                size={px2DpY(24)}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>
        <List.Section>
          <List.Item
            onPress={() => {}}
            title={
              <Text style={styles.listItemTitle} allowFontScaling={false}>
                检查更新
              </Text>
            }
            style={styles.listItem}
            left={() => (
              <MaterialIcons
                name="update"
                size={px2DpY(24)}
                color={theme.colors.primary}
              />
            )}
          />
          <List.Item
            onPress={() => {
              navigation.navigate('About');
            }}
            title={
              <Text style={styles.listItemTitle} allowFontScaling={false}>
                关于应用
              </Text>
            }
            style={styles.listItem}
            left={() => (
              <MaterialIcons
                name="info"
                size={px2DpY(24)}
                color={theme.colors.primary}
              />
            )}
          />
        </List.Section>
        <View style={styles.footerContainer}>
          <View>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.tertiaryContentText,
                },
              ]}>
              © 2023 绿胡子大叔
            </Text>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.tertiaryContentText,
                },
              ]}>
              https://website.com
            </Text>
          </View>
          <View>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.tertiaryContentText,
                },
              ]}>
              App所引用的FFXIV相关资料与图像：
            </Text>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.tertiaryContentText,
                },
              ]}>
              Copyright (C) 2010 - 2023 SQUARE ENIX CO.
            </Text>
            <Text
              style={[
                styles.footerText,
                {
                  color: theme.colors.tertiaryContentText,
                },
              ]}>
              All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingLeft: px2DpX(24),
    paddingRight: px2DpX(24),
  },
  listItemTitle: {
    fontSize: px2DpY(16),
  },
  listScrollViewContentContainerStyle: {
    flexGrow: 1,
  },
  footerContainer: {
    alignItems: 'center',
    gap: px2DpY(10),
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: px2DpY(20),
  },
  footerText: {
    textAlign: 'center',
    fontSize: px2DpY(12),
    lineHeight: px2DpY(18),
  },
});

export default Settings;
