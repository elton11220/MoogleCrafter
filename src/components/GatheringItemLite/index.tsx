import {View, StyleSheet} from 'react-native';
import type {FC} from 'react';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import FastImage from 'react-native-fast-image';
import {itemIcons} from '../../images/gameResource';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const GatheringItemLite: FC<GatheringItemLite.Props> = props => {
  const {
    data: {name, icon, gatheringItemLevel, gatheringItemStars},
    prefix,
  } = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <View style={styles.container}>
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
        style={[
          styles.itemName,
          {
            color: theme.colors.primaryContentText,
          },
        ]}>
        {name}
      </Text>
      <View style={styles.rightContainer}>
        <Text
          allowFontScaling={false}
          style={[
            styles.rightText,
            {
              color: theme.colors.tertiaryContentText,
            },
          ]}>{`LV${gatheringItemLevel}`}</Text>
        <MaterialIcons
          name="star"
          size={px2DpY(13)}
          color={theme.colors.tertiaryContentText}
        />
        <Text
          allowFontScaling={false}
          style={[
            styles.rightText,
            {
              color: theme.colors.tertiaryContentText,
            },
          ]}>{`${gatheringItemStars}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: px2DpX(25),
    paddingVertical: px2DpY(7),
    flexDirection: 'row',
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
