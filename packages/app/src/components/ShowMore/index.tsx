import {StyleSheet, Pressable} from 'react-native';
import {useCallback} from 'react';
import type {FC} from 'react';
import {memo} from 'react';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';

const ShowMore: FC<ShowMore.Props> = props => {
  const {unfold, onChange, foldText, unfoldText} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const textValue = () => {
    if (unfold) {
      return unfoldText ?? '收起列表';
    } else {
      return foldText ?? '查看全部';
    }
  };
  const onPress = useCallback(() => {
    if (unfold) {
      onChange(false);
    } else {
      onChange(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unfold, onChange]);
  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text
        style={[styles.text, {color: theme.colors.tertiaryContentText}]}
        allowFontScaling={false}>
        {textValue()}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: px2DpX(2),
    paddingTop: px2DpY(15),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: px2DpY(12),
  },
});

export default memo(ShowMore);
