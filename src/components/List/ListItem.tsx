import type {FC} from 'react';
import {memo} from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import type {ListItem as ListItemType} from './typings';

const ListItem: FC<ListItemType.Props> = props => {
  const {title, right, onPress} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
      android_ripple={{
        color: onPress ? theme.colors.rippleBackgroundColor : null,
      }}>
      {typeof title === 'string' ? (
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[
            styles.titleText,
            {
              color: theme.colors.primaryContentText,
            },
          ]}>
          {title}
        </Text>
      ) : (
        title
      )}
      {typeof right === 'string' ? (
        <Text
          allowFontScaling={false}
          numberOfLines={1}
          style={[
            styles.rightText,
            {
              color: theme.colors.secondaryContentText,
            },
          ]}>
          {right}
        </Text>
      ) : right ? (
        right
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    height: px2DpY(64),
    paddingHorizontal: px2DpX(18),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: px2DpY(15),
    fontWeight: 'bold',
  },
  rightText: {
    fontSize: px2DpY(14),
  },
});

export default memo(ListItem);
