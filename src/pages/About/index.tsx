import {useNavigation} from '@react-navigation/native';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import {Appbar, Text, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpY} from '../../utils/dimensionConverter';

const About = () => {
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
        <Appbar.BackAction
          rippleColor={theme.colors.rippleBackgroundColor}
          onPress={() => {
            navigation.goBack();
          }}
          size={px2DpY(24)}
        />
        <Appbar.Content title="关于应用" titleStyle={styles.titleStyle} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <Image
          source={require('../../images/ic_launcher.png')}
          resizeMode="contain"
          style={styles.appIcon}
        />
        <View>
          <Text
            allowFontScaling={false}
            style={[styles.appName, {color: theme.colors.primaryContentText}]}>
            FFXIV 采集时钟
          </Text>
          <Text
            allowFontScaling={false}
            style={[
              styles.appVersion,
              {color: theme.colors.secondaryContentText},
            ]}>
            应用版本：1.0.0-stable-230213
          </Text>
          <Text
            allowFontScaling={false}
            style={[
              styles.appVersion,
              {color: theme.colors.secondaryContentText},
            ]}>
            数据版本：2023.02.16.0000.0000-6.25-chs
          </Text>
        </View>
        <View>
          <Text
            allowFontScaling={false}
            style={[styles.appDesc, {color: theme.colors.primaryContentText}]}>
            设计 & 开发 & 数据：绿胡子大叔
          </Text>
          <Text
            allowFontScaling={false}
            style={[styles.appDesc, {color: theme.colors.primaryContentText}]}>
            官方网站：https://website.com
          </Text>
          <Text
            allowFontScaling={false}
            style={[styles.appDesc, {color: theme.colors.primaryContentText}]}>
            问题反馈 / 建议：username@domain.com
          </Text>
        </View>
        <View style={styles.copyrightContainer}>
          <View>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              © 2023 绿胡子大叔
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              https://website.com
            </Text>
          </View>
          <View>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              App所引用的FFXIV相关资料与图像：
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              Copyright (C) 2010 - 2023 SQUARE ENIX CO.
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              All rights reserved.
            </Text>
          </View>
          <View>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              本应用涉及的游戏《最终幻想14》由SQUARE
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              ENIX制作，简体中文版由盛趣游戏运营。应用内使用
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              的游戏资源仅供识别，其版权为SQUARE ENIX所有
            </Text>
          </View>
          <View>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              肥肥咖啡交互地图
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              Powered by FFCafe
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              FFCafe 肥肥咖啡 & 亚拉戈科技（深圳）有限公司
            </Text>
          </View>
          <View>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              最终幻想XIV中文维基
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              https://ff14.huijiwiki.com
            </Text>
          </View>
          <View>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              游戏数据挖掘 & 资源收集工具
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              SaintCoinach by xivapi
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              FFXIV Gathering Data Extractor by 绿胡子大叔
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.copyrightText,
                {color: theme.colors.tertiaryContentText},
              ]}>
              FFXIV Gathering Data - Icons Collector by 绿胡子大叔
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: px2DpY(22),
  },
  scrollViewContentContainer: {
    alignItems: 'center',
    gap: px2DpY(20),
    paddingTop: px2DpY(50),
    paddingBottom: px2DpY(30),
  },
  appIcon: {
    height: px2DpY(70),
    width: px2DpY(70),
  },
  appName: {
    fontSize: px2DpY(17),
    textAlign: 'center',
    lineHeight: px2DpY(22),
  },
  appVersion: {
    fontSize: px2DpY(12),
    lineHeight: px2DpY(20),
    textAlign: 'center',
  },
  appDesc: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(22),
    textAlign: 'center',
  },
  copyrightContainer: {
    paddingTop: px2DpY(20),
    alignItems: 'center',
    gap: px2DpY(10),
  },
  copyrightText: {
    fontSize: px2DpY(12),
    textAlign: 'center',
    lineHeight: px2DpY(20),
  },
});

export default About;
