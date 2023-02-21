import {useNavigation} from '@react-navigation/native';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Appbar, List, RadioButton, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Tip from '../../components/Tip';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {languageSettingsSelector, useStore} from '../../store';
import {px2DpY} from '../../utils/dimensionConverter';

const LanguageSettings = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  const {uiLang, resLang} = useStore(languageSettingsSelector);
  const updateLanguageSettings = useStore(s => s.updateLanguageSettings);
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
        <Appbar.Content title="语言设置" titleStyle={styles.titleStyle} />
      </Appbar.Header>
      <ScrollView>
        <List.Section>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            应用界面语言
          </List.Subheader>
          <RadioButton.Group
            value={uiLang}
            onValueChange={value =>
              updateLanguageSettings('uiLang', value as ZustandStore.UiLang)
            }>
            <RadioButton.Item
              labelStyle={styles.listItemTitleStyle}
              label="简体中文"
              value="zh-cn"
            />
            <RadioButton.Item
              labelStyle={styles.listItemTitleStyle}
              label="English"
              value="en-us"
            />
          </RadioButton.Group>
        </List.Section>
        <List.Section>
          <List.Subheader
            style={[
              styles.listSectionTitleStyle,
              {color: theme.colors.primary},
            ]}>
            素材资源语言
          </List.Subheader>
          <RadioButton.Group
            value={resLang}
            onValueChange={value =>
              updateLanguageSettings('resLang', value as ZustandStore.ResLang)
            }>
            <RadioButton.Item
              labelStyle={styles.listItemTitleStyle}
              disabled
              label="简体中文"
              value="zh-cn"
            />
            <RadioButton.Item
              labelStyle={styles.listItemTitleStyle}
              disabled
              label="English"
              value="en-us"
            />
            <RadioButton.Item
              labelStyle={styles.listItemTitleStyle}
              disabled
              label="日本語"
              value="ja-jp"
            />
          </RadioButton.Group>
          <Tip title="此功能暂不可用，请等待后续版本更新" />
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
});

export default LanguageSettings;
