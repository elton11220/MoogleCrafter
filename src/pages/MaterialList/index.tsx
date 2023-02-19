import {FC} from 'react';
import {View} from 'react-native';
import {Appbar, useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MaterialList: FC = () => {
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
        <Appbar.Content title="素材列表" />
      </Appbar.Header>
    </View>
  );
};

export default MaterialList;
