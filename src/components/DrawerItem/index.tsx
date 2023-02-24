import {View, StyleSheet} from 'react-native';
import {memo} from 'react';
import type {FC} from 'react';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';

const DrawerItem: FC<DrawerItem.Props> = props => {
  const {title, children} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {title ? (
        <View style={styles.titleContainer}>
          <Text allowFontScaling={false} style={styles.titleText}>
            {title}
          </Text>
        </View>
      ) : null}
      <View style={styles.childrenContainer}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: px2DpX(12),
    paddingRight: px2DpX(12),
    paddingBottom: px2DpY(12),
  },
  titleContainer: {
    paddingTop: px2DpY(18),
    paddingBottom: px2DpY(18),
    paddingLeft: px2DpX(16),
    paddingRight: px2DpX(16),
  },
  titleText: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(20),
  },
  childrenContainer: {
    paddingTop: px2DpY(10),
    paddingBottom: px2DpY(10),
    paddingLeft: px2DpX(10),
    paddingRight: px2DpX(10),
    gap: px2DpY(15),
  },
});

export default memo(DrawerItem);
