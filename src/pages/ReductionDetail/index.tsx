import {View, StyleSheet} from 'react-native';
import type {FC} from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button, Text, useTheme} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RootStackScreenProps} from '../../navigation/types';
import FastImage from 'react-native-fast-image';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {itemIcons} from '../../images/gameResource';
import Tag from '../../components/Tag';
import {extendedDarkColors} from '../../config/themes/extension';
import Tip from '../../components/Tip';
import GatheringItemLite from '../../components/GatheringItemLite';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';

const ReductionDetail: FC = () => {
  const insets = useSafeAreaInsets();
  const {
    params: {targetItem, rawItems},
  } = useRoute<RootStackScreenProps<'ReductionDetail'>['route']>();
  const computeGatheringOccupation = (id: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (id === 1 || id === 2) {
      return '采矿工';
    } else if (id === 3 || id === 4) {
      return '园艺工';
    } else {
      return '捕鱼人';
    }
  };
  const theme = useTheme<typeof DefaultLightTheme>();
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: 'rgba(0,0,0,.8)',
        justifyContent: 'center',
      }}>
      <View style={styles.infoCard}>
        <FastImage
          style={styles.itemIcon}
          source={itemIcons.get(targetItem.icon.toString())}
          resizeMode={FastImage.resizeMode.stretch}
        />
        <View style={styles.infoCardContent}>
          <View style={styles.infoCardRow}>
            <Text allowFontScaling={false} style={styles.infoCardTitle}>
              {targetItem.name}
            </Text>
            <Tag>{targetItem.itemCategory}</Tag>
          </View>
          <View style={styles.infoCardRow}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.infoCardDesc}>
              {targetItem.desc}
            </Text>
          </View>
        </View>
      </View>
      <Tip title="通过精选以下素材可获得此物品" />
      <View style={styles.rawItemsContainer}>
        {rawItems.map(item => (
          <GatheringItemLite
            key={item.id}
            data={item}
            flex
            textStyle={{color: extendedDarkColors.primaryContentText}}
            suffix={<Tag>{computeGatheringOccupation(item.gatheringType)}</Tag>}
          />
        ))}
      </View>
      <View style={styles.footer}>
        <Button
          style={styles.footerButton}
          mode="contained"
          theme={{
            colors: {
              primary: theme.colors.primary,
            },
          }}
          textColor={theme.colors.onPrimary}
          labelStyle={{fontSize: px2DpY(14), lineHeight: px2DpY(18)}}
          onPress={() => {
            navigation.goBack();
          }}>
          返回
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(16),
    paddingLeft: px2DpX(24),
    paddingRight: px2DpX(24),
    paddingTop: px2DpY(14),
    paddingBottom: px2DpY(14),
  },
  infoCardContent: {
    justifyContent: 'center',
    gap: px2DpY(5),
    flexGrow: 1,
  },
  infoCardTitle: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(17),
    color: extendedDarkColors.primaryContentText,
  },
  infoCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(3),
  },
  infoCardDesc: {
    fontSize: px2DpY(13),
    lineHeight: px2DpY(18),
    color: extendedDarkColors.tertiaryContentText,
  },
  itemIcon: {
    height: px2DpY(56),
    width: px2DpY(56),
    borderRadius: px2DpY(28),
  },
  rawItemsContainer: {
    paddingHorizontal: px2DpX(33),
    paddingVertical: px2DpY(10),
  },
  footer: {
    paddingTop: px2DpY(10),
    alignItems: 'center',
  },
  footerButton: {
    width: px2DpX(150),
    height: px2DpY(40),
  },
});

export default ReductionDetail;
