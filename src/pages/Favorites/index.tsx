import React, {FC} from 'react';
import {View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Favorites: FC = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
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
          accessibilityLabelledBy=""
          accessibilityLanguage="zh_CN"
        />
      </Appbar.Header>
    </View>
  );
};

export default Favorites;
