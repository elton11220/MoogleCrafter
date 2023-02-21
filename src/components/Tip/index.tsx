import {View, StyleSheet} from 'react-native';
import type {FC} from 'react';
import {memo} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';

const Tip: FC<Tip.Props> = props => {
  const {title, numberOfLines, width} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <View style={styles.container}>
      <MaterialIcons
        name="info"
        size={px2DpY(13)}
        color={theme.colors.tertiaryContentText}
      />
      <Text
        style={[
          styles.titleText,
          {color: theme.colors.tertiaryContentText, width: width},
        ]}
        allowFontScaling={false}
        numberOfLines={numberOfLines}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px2DpX(3),
    paddingLeft: px2DpX(10),
  },
  titleText: {
    fontSize: px2DpY(13),
  },
});

export default memo(Tip);
