import type {FC} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import type {Tag as TagType} from './typings';

const Tag: FC<TagType.Props> = props => {
  const theme = useTheme<typeof DefaultLightTheme>();
  const {
    children,
    color = theme.colors.tertiaryContentText,
    labelStyle,
    containerStyle,
  } = props;
  return (
    <View style={[styles.container, {borderColor: color}, containerStyle]}>
      <Text
        style={[styles.label, {color}, labelStyle]}
        allowFontScaling={false}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: px2DpX(5),
    paddingRight: px2DpX(5),
    borderWidth: 1,
    borderRadius: px2DpY(5),
  },
  label: {
    fontSize: px2DpY(12),
    lineHeight: px2DpY(18),
  },
});

export default Tag;
