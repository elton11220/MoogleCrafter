import {View, StyleSheet, Pressable} from 'react-native';
import type {FC} from 'react';
import {memo} from 'react';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';

const RegionDropdownMenuItem: FC<RegionDropdownMenuItem.Props> = props => {
  const {selected, onSelected, label, id} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <Pressable
      style={styles.container}
      android_ripple={{color: theme.colors.rippleBackgroundColor}}
      onPress={e => {
        e.stopPropagation();
        onSelected(id);
      }}>
      <Text
        allowFontScaling={false}
        style={[
          styles.label,
          {
            color: selected
              ? theme.colors.primary
              : theme.colors.tertiaryContentText,
          },
        ]}>
        {label}
      </Text>
      <View
        style={[
          styles.optionIndicator,
          {
            backgroundColor: selected ? theme.colors.primary : undefined,
          },
        ]}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: px2DpX(25),
    paddingRight: px2DpX(11),
    paddingTop: px2DpY(7),
    paddingBottom: px2DpY(7),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: px2DpY(13),
    lineHeight: px2DpY(20),
  },
  optionIndicator: {
    height: px2DpY(5),
    width: px2DpY(5),
    borderRadius: px2DpY(2.5),
  },
});

export default memo(RegionDropdownMenuItem);
