import React, {FC, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Appbar,
  IconButton,
  Searchbar,
  Text,
  useTheme,
} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {useStore} from '../../store';

const Favorites: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme<typeof DefaultLightTheme>();
  const {hideSplashScreen} = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  useEffect(() => {
    hideSplashScreen();
  }, [hideSplashScreen]);
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: insets.bottom,
        backgroundColor: theme.colors.background,
      }}>
      <Appbar.Header>
        <Appbar.Content
          title="我的收藏"
          titleStyle={styles.appBarHeaderTitle}
        />
      </Appbar.Header>
      <View style={styles.searchBarContainer}>
        <Searchbar
          value={searchQuery}
          onChangeText={text => {
            setSearchQuery(text);
          }}
          elevation={0}
          placeholder="搜索收藏的素材"
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surfaceVariant,
            },
          ]}
          inputStyle={styles.searchBarInput}
        />
        <IconButton
          icon={({color, size}) => (
            <MaterialCommunityIcons
              name="image-filter-none"
              color={color}
              size={size}
            />
          )}
          mode="contained"
          size={px2DpY(18)}
          style={styles.searchBarFilterButton}
        />
      </View>
      <View style={styles.topItemContainer}>
        <View style={styles.topItemIndicatorContainer}>
          <Text
            allowFontScaling={false}
            style={[
              styles.topItemIndicatorTitle,
              {
                color: theme.colors.primary,
              },
            ]}>
            置顶素材
          </Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={px2DpY(20)}
            color={theme.colors.secondaryContentText}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingTop: px2DpY(5),
    paddingBottom: px2DpY(10),
    paddingLeft: px2DpX(16),
    paddingRight: px2DpX(16),
    flexDirection: 'row',
    gap: px2DpX(8),
    width: '100%',
  },
  searchBar: {
    flex: 1,
    height: px2DpY(50),
    borderRadius: px2DpY(25),
  },
  searchBarInput: {
    fontSize: px2DpY(16),
  },
  searchBarFilterButton: {
    height: px2DpY(50),
    width: px2DpY(50),
    margin: 0,
    borderRadius: px2DpY(25),
  },
  topItemContainer: {
    paddingLeft: px2DpX(16),
    paddingRight: px2DpX(16),
  },
  topItemIndicatorContainer: {
    paddingTop: px2DpY(18),
    paddingBottom: px2DpY(5),
    paddingLeft: px2DpX(8),
    paddingRight: px2DpX(3),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topItemIndicatorTitle: {
    fontSize: px2DpY(14),
  },
  topItemScrollView: {
    width: '100%',
  },
  gatheringItemListContainer: {
    paddingTop: px2DpY(0),
  },
  appBarHeaderTitle: {
    fontSize: px2DpY(22),
    lineHeight: px2DpY(28),
  },
});

export default Favorites;
