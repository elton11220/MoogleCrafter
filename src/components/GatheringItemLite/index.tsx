import {View, StyleSheet, Pressable} from 'react-native';
import type {FC} from 'react';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import FastImage from 'react-native-fast-image';
import {itemIcons} from '../../images/gameResource';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const emptyPressHandler = (_: number) => {};

const GatheringItemLite: FC<GatheringItemLite.Props> = props => {
  const {
    data: {id, name, icon},
    prefix,
    showRightNavIcon = false,
    onPress = emptyPressHandler,
  } = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <Pressable
      style={styles.container}
      onPress={() => {
        onPress(id);
      }}>
      {prefix ? (
        <View style={styles.prefixContainer}>
          <Text
            allowFontScaling={false}
            style={[
              styles.prefixText,
              {
                color: theme.colors.secondaryContentText,
              },
            ]}>
            {prefix}
          </Text>
        </View>
      ) : null}
      <FastImage
        style={styles.itemIcon}
        source={itemIcons.get(icon.toString())}
        resizeMode={FastImage.resizeMode.stretch}
      />
      <Text
        allowFontScaling={false}
        numberOfLines={1}
        style={[
          styles.itemName,
          {
            color: theme.colors.primaryContentText,
          },
        ]}>
        {name}
      </Text>
      {showRightNavIcon ? (
        <View style={styles.rightContainer}>
          <MaterialIcons
            name="chevron-right"
            size={px2DpY(18)}
            color={theme.colors.tertiaryContentText}
          />
        </View>
      ) : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: px2DpY(7),
    flexDirection: 'row',
    width: px2DpX(157),
    gap: px2DpX(10),
    alignItems: 'center',
  },
  prefixContainer: {
    width: px2DpY(23),
    height: px2DpY(23),
    alignItems: 'center',
  },
  prefixText: {
    lineHeight: px2DpY(20),
    fontSize: px2DpY(12),
  },
  itemIcon: {
    height: px2DpY(30),
    width: px2DpY(30),
    borderRadius: px2DpY(5),
  },
  itemName: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(20),
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(3),
  },
  rightText: {
    fontSize: px2DpY(12),
    lineHeight: px2DpY(20),
  },
});

export default GatheringItemLite;
