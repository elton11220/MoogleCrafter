import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import {Appbar, Text, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpY} from '../../utils/dimensionConverter';

const About = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  const [detailWebViewHeight, setDetailWebViewHeight] = useState(400);
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
      <ScrollView
        contentContainerStyle={styles.scrollViewContentContainer}
        overScrollMode="never">
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
        <View style={{width: '100%'}}>
          <WebView
            source={{
              uri: `https://res.elton11220.top/about.html?bgColor=${encodeURIComponent(
                theme.colors.background,
              )}&dark=${theme.dark}`,
            }}
            style={{height: detailWebViewHeight}}
            scrollEnabled={false}
            overScrollMode="never"
            startInLoadingState
            onMessage={event =>
              Number(event.nativeEvent.data).toString() !== 'NaN'
                ? setDetailWebViewHeight(
                    Number.parseInt(event.nativeEvent.data, 10) as number,
                  )
                : undefined
            }
            injectedJavaScript="window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight);"
            javaScriptEnabled={true}
          />
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
});

export default About;
