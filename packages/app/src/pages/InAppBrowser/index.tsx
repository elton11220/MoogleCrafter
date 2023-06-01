import {useNavigation, useRoute} from '@react-navigation/native';
import {useMemo, useState} from 'react';
import type {FC} from 'react';
import {View, StyleSheet, Linking} from 'react-native';
import {useTheme, Appbar, Menu} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {RootStackScreenProps} from '../../navigation/types';
import {px2DpY} from '../../utils/dimensionConverter';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const InAppBrowser: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  const {
    params: {title, url, allowOpenInSystemBrowser},
  } = useRoute<RootStackScreenProps<'InAppBrowser'>['route']>();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const appHeaderAction = useMemo(
    () => (
      <Appbar.Action
        icon={({size, color}) => (
          <MaterialIcons size={size} color={color} name="more-horiz" />
        )}
        onPress={() => setMenuVisible(true)}
      />
    ),
    [],
  );
  const appHeaderMenu = useMemo(
    () => (
      <Menu
        visible={isMenuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={appHeaderAction}>
        {allowOpenInSystemBrowser ? (
          <Menu.Item
            title="在浏览器中打开"
            leadingIcon={({size, color}) => (
              <MaterialIcons name="open-in-browser" size={size} color={color} />
            )}
            onPress={() => {
              Linking.openURL(url);
            }}
          />
        ) : null}
      </Menu>
    ),
    [allowOpenInSystemBrowser, appHeaderAction, isMenuVisible, url],
  );
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}>
      <Appbar.Header style={{backgroundColor: theme.colors.secondaryContainer}}>
        <Appbar.BackAction
          rippleColor={theme.colors.rippleBackgroundColor}
          onPress={() => {
            navigation.goBack();
          }}
          size={px2DpY(24)}
        />
        {title ? (
          <Appbar.Content title={title} titleStyle={styles.titleStyle} />
        ) : null}
        {allowOpenInSystemBrowser ? appHeaderMenu : null}
      </Appbar.Header>
      <WebView source={{uri: url}} startInLoadingState />
    </View>
  );
};

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: px2DpY(22),
  },
});

export default InAppBrowser;
