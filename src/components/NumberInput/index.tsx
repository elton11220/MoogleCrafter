import {View, StyleSheet, Pressable} from 'react-native';
import type {FC} from 'react';
import {memo} from 'react';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';

const NumberInput: FC<NumberInput.Props> = props => {
  const {min, max, value, setValue, clearable, step} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const add = () => {
    if (value === null) {
      setValue(min);
    } else {
      if (value < max) {
        setValue(value + step);
      }
    }
  };
  const substract = () => {
    if (value === min) {
      setValue(null);
    } else {
      if (value !== null) {
        setValue(value - step);
      }
    }
  };
  const reset = () => {
    setValue(null);
  };
  return (
    <View style={styles.container}>
      <Pressable
        android_ripple={{color: theme.colors.rippleBackgroundColor}}
        onPress={substract}
        style={styles.buttonContainer}>
        <MaterialIcons
          name="remove"
          size={px2DpY(24)}
          color={theme.colors.secondaryContentText}
        />
      </Pressable>
      <View
        style={[
          styles.numberContainer,
          {borderColor: theme.colors.secondaryContentText},
        ]}>
        <Text
          allowFontScaling={false}
          style={[styles.numberText, {color: theme.colors.primaryContentText}]}>
          {value !== null ? value : '/'}
        </Text>
      </View>
      <Pressable
        android_ripple={{color: theme.colors.rippleBackgroundColor}}
        onPress={add}
        style={styles.buttonContainer}>
        <MaterialIcons
          name="add"
          size={px2DpY(24)}
          color={theme.colors.secondaryContentText}
        />
      </Pressable>
      {clearable ? (
        <Pressable
          android_ripple={{color: theme.colors.rippleBackgroundColor}}
          onPress={reset}
          style={styles.buttonContainer}>
          <MaterialIcons
            name="replay"
            size={px2DpY(24)}
            color={theme.colors.secondaryContentText}
          />
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: px2DpX(12),
  },
  numberContainer: {
    width: px2DpX(60),
    height: px2DpY(40),
    borderRadius: px2DpY(4),
    borderWidth: px2DpX(1),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontSize: px2DpY(14),
  },
  buttonContainer: {
    paddingTop: px2DpY(2),
    paddingBottom: px2DpY(2),
    paddingLeft: px2DpX(2),
    paddingRight: px2DpX(2),
  },
});

export default memo(NumberInput);
