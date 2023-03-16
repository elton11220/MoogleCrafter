import {View, StyleSheet} from 'react-native';
import type {FC} from 'react';
import FastImage from 'react-native-fast-image';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';

const ListEmptyTip: FC<ListEmptyTip.Props> = props => {
  const {text} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <View style={styles.container}>
      <FastImage
        source={require('../../images/moogle.png')}
        style={styles.moogleImg}
      />
      <Text
        allowFontScaling={false}
        style={[styles.text, {color: theme.colors.tertiaryContentText}]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: px2DpY(35),
    alignItems: 'center',
    gap: px2DpY(20),
  },
  moogleImg: {
    height: px2DpY(147),
    width: px2DpX(157),
  },
  text: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(20),
  },
});

export default ListEmptyTip;
