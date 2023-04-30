import {memo} from 'react';
import type {FC} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import type {Divider as DividerType} from './typings';

const Divider: FC<DividerType.Props> = props => {
  const {
    title,
    lineStyle = 'dashed',
    style: extraStyle,
    textAlign = 'center',
    showLine = true,
  } = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <View style={[styles.container, extraStyle]}>
      {showLine && textAlign === 'center' ? (
        <View
          style={[
            styles.line,
            {
              borderStyle: lineStyle,
              borderColor: theme.colors.tertiaryContentText,
            },
          ]}
        />
      ) : null}
      {title ? (
        <>
          <Text
            allowFontScaling={false}
            style={[
              styles.titleText,
              {
                color: theme.colors.tertiaryContentText,
              },
            ]}>
            {title}
          </Text>
        </>
      ) : null}
      {showLine && (title || textAlign === 'left') ? (
        <View
          style={[
            styles.line,
            {
              borderStyle: lineStyle,
              borderColor: theme.colors.tertiaryContentText,
            },
          ]}
        />
      ) : null}
      {!showLine && textAlign === 'left' ? (
        <View style={styles.noLineAlignLeftPlaceHolder} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: px2DpX(5),
  },
  titleText: {
    fontSize: px2DpY(12),
    lineHeight: px2DpY(16),
  },
  line: {
    borderTopWidth: px2DpY(1),
    height: px2DpY(1),
    flex: 1,
  },
  noLineAlignLeftPlaceHolder: {
    flex: 1,
  },
});

export default memo(Divider);
