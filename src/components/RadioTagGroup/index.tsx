import {View, StyleSheet, Pressable} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const RadioTagGroup: <T>(
  props: RadioTagGroup.Props<T>,
) => JSX.Element = props => {
  const {value, setValue, items, showSelectedIcon} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <View style={styles.container}>
      {items.map((item, idx) => (
        <View
          key={idx}
          style={[
            styles.item,
            {
              backgroundColor: item.linearGradient
                ? undefined
                : value === item.key
                ? item.style
                  ? item.style.selectedBackground
                  : theme.colors.primary
                : item.style
                ? item.style.unselectedBackground
                : theme.colors.secondaryContainer,
              borderColor:
                value === item.key
                  ? item.style
                    ? item.style.selectedBorderColor
                    : theme.colors.primary
                  : item.style
                  ? item.style.unselectedBorderColor
                  : theme.colors.secondaryContainer,
              borderWidth: item.style ? px2DpX(1) : 0,
            },
          ]}>
          {item.linearGradient ? (
            <LinearGradient
              style={styles.linearGradientContainer}
              colors={item.linearGradient.colors}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            />
          ) : null}
          {showSelectedIcon && value === item.key ? (
            <MaterialIcons
              name="check-circle"
              size={px2DpY(12)}
              color="#3bdf1b"
              style={styles.selectedIcon}
            />
          ) : null}
          <Pressable
            android_ripple={{color: theme.colors.rippleBackgroundColor}}
            style={[
              styles.pressableContainer,
              {
                paddingLeft: item.style ? px2DpX(11) : px2DpX(12),
                paddingRight: item.style ? px2DpX(11) : px2DpX(12),
                paddingTop: item.style ? px2DpY(5) : px2DpY(6),
                paddingBottom: item.style ? px2DpY(5) : px2DpY(6),
              },
            ]}
            onPress={() => {
              setValue(item.key);
            }}>
            <Text
              allowFontScaling={false}
              style={[
                styles.title,
                {
                  color: item.style
                    ? '#fff'
                    : value === item.key
                    ? theme.colors.background
                    : theme.colors.primaryContentText,
                },
              ]}>
              {item.label}
            </Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: px2DpX(10),
    flexGrow: 1,
    flexWrap: 'wrap',
  },
  item: {
    borderRadius: px2DpY(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: px2DpX(72),
    overflow: 'hidden',
    position: 'relative',
    borderWidth: px2DpY(1),
  },
  title: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(20),
  },
  pressableContainer: {
    minWidth: px2DpX(72),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIcon: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  linearGradientContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
});

export default RadioTagGroup;
