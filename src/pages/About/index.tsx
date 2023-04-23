import {useNavigation} from '@react-navigation/native';
import {useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  ToastAndroid,
} from 'react-native';
import {Appbar, Text, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpY} from '../../utils/dimensionConverter';
import versionInfo from '../../config/version';
import * as List from '../../components/List';
import ConfirmDialog from '../../components/ConfirmDialog';
import type {ConfirmDialogInstance} from '../../components/ConfirmDialog';
import {privacyPolicy, userAgreement} from '../../config/strings';
import {openAppDetailsInAppMarket} from '../../native/AppMarket';

const About = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  const privacyPolicyDialogInstance = useRef<ConfirmDialogInstance | null>(
    null,
  );
  const userAgreementDialogInstance = useRef<ConfirmDialogInstance | null>(
    null,
  );
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}>
      <ConfirmDialog
        ref={privacyPolicyDialogInstance}
        title="隐私政策"
        content={privacyPolicy}
        showConfirm={false}
        showCancel={false}
        dismissable
      />
      <ConfirmDialog
        ref={userAgreementDialogInstance}
        title="用户协议"
        content={userAgreement}
        showConfirm={false}
        showCancel={false}
        dismissable
      />
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
      <ScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        overScrollMode="never">
        <Image
          source={require('../../images/ic_launcher.png')}
          resizeMode="contain"
          style={styles.appIcon}
        />
        <View style={styles.basicInfoContainer}>
          <Text
            allowFontScaling={false}
            style={[styles.appName, {color: theme.colors.primaryContentText}]}>
            {versionInfo.appName}
          </Text>
          <View>
            <Text
              allowFontScaling={false}
              style={[
                styles.appVersion,
                {color: theme.colors.secondaryContentText},
              ]}>
              应用版本：{versionInfo.compositedVersionSymbol}
            </Text>
            <Text
              allowFontScaling={false}
              style={[
                styles.appVersion,
                {color: theme.colors.secondaryContentText},
              ]}>
              数据版本：{versionInfo.resVersion}
            </Text>
          </View>
        </View>
        <List.Section title="作者信息">
          <List.Item title="开发 / 数据 / UI" right="绿胡子大叔" />
          <List.Item
            title="问题反馈"
            right="793705875@qq.com"
            onPress={() => {
              Linking.canOpenURL('mailto:793705875@qq.com').then(result => {
                if (result) {
                  Linking.openURL('mailto:793705875@qq.com');
                } else {
                  ToastAndroid.show('您没有安装邮件应用', ToastAndroid.SHORT);
                }
              });
            }}
          />
        </List.Section>
        <List.Section title="其他">
          <List.Item
            title="隐私政策"
            onPress={() => {
              if (privacyPolicyDialogInstance.current) {
                privacyPolicyDialogInstance.current?.show();
              }
            }}
          />
          <List.Item
            title="用户协议"
            onPress={() => {
              if (userAgreementDialogInstance.current) {
                userAgreementDialogInstance.current?.show();
              }
            }}
          />
          <List.Item
            title="评价应用"
            onPress={() => openAppDetailsInAppMarket()}
          />
        </List.Section>
        <List.Section title="版权声明">
          <View style={styles.copyrightContainer}>
            <View>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                © 2023 绿胡子大叔
              </Text>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                https://space.bilibili.com/21598091
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                # App所引用的FFXIV相关资料与图像
              </Text>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                Copyright (C) 2010 - 2023 SQUARE ENIX CO.
              </Text>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                All rights reserved.
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                # 本程序涉及的游戏《最终幻想14》由SQUARE
                ENIX制作，简体中文版由盛趣游戏运营。应用内使用的游戏资源仅供识别，其版权为SQUARE
                ENIX所有
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                # 肥肥咖啡交互地图
              </Text>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                Powered by FFCafe
              </Text>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                FFCafe 肥肥咖啡 & 亚拉戈科技（深圳）有限公司
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                # 最终幻想XIV中文维基
              </Text>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                https://ff14.huijiwiki.com
              </Text>
            </View>
            <View>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                # 游戏数据挖掘 & 资源提取工具
              </Text>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                SaintCoinach by xivapi
              </Text>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                FFXIV Gathering Data Extractor by 绿胡子大叔
              </Text>
              <Text
                style={[
                  styles.copyrightRow,
                  {color: theme.colors.secondaryContentText},
                ]}
                allowFontScaling={false}>
                FFXIV Gathering Data Icons Collector by 绿胡子大叔
              </Text>
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
  scrollViewContentContainer: {
    alignItems: 'center',
    paddingTop: px2DpY(50),
    paddingBottom: px2DpY(30),
  },
  basicInfoContainer: {
    paddingVertical: px2DpY(10),
    gap: px2DpY(3),
  },
  appIcon: {
    height: px2DpY(80),
    width: px2DpY(80),
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
  copyrightContainer: {
    gap: px2DpY(10),
    paddingVertical: px2DpY(15),
    paddingHorizontal: px2DpY(18),
  },
  copyrightRow: {
    fontSize: px2DpY(12),
    lineHeight: px2DpY(20),
  },
});

export default About;
