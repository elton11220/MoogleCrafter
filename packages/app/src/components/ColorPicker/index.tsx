import {View, StyleSheet, ScrollView, Pressable} from 'react-native';
import type {FC} from 'react';
import {memo} from 'react';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {useTheme} from 'react-native-paper';
import {DefaultLightTheme} from '../../config/themes/defaultTheme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ColorPicker: FC<ColorPicker.Props> = props => {
  const {colorList, value, setValue} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <ScrollView horizontal contentContainerStyle={styles.container}>
      {colorList.map(item => (
        <View
          style={[
            styles.colorBlock,
            {
              backgroundColor: item.value,
            },
          ]}
          key={item.key}>
          <Pressable
            android_ripple={{
              color: theme.colors.rippleBackgroundColor,
            }}
            style={styles.pressLayer}
            onPress={() => {
              setValue(item.key);
            }}>
            {value === item.key ? (
              <MaterialIcons
                name="check-circle"
                size={px2DpY(15)}
                color="#3bdf1b"
                style={styles.checkIcon}
              />
            ) : null}
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: px2DpX(10),
  },
  colorBlock: {
    width: px2DpY(55),
    height: px2DpY(55),
    borderRadius: px2DpY(10),
    overflow: 'hidden',
  },
  pressLayer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  checkIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default memo(ColorPicker);
