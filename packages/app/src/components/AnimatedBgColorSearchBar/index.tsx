import {memo, useCallback, useMemo} from 'react';
import type {FC} from 'react';
import {Pressable, StyleSheet, TextInput, View} from 'react-native';
import {useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import AnimatedBackgroundColorView from '../AnimatedBackgroundColorView';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const AnimatedBgColorSearchBar: FC<AnimatedBgColorSearchBar.Props> = props => {
  const {activated, value, onChangeText, placeholder} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const clearValue = useCallback(() => {
    onChangeText('');
  }, [onChangeText]);
  const content = useMemo(
    () => (
      <>
        <MaterialIcons
          name="search"
          size={px2DpY(24)}
          color={theme.colors.secondaryContentText}
        />
        <TextInput
          style={[styles.textInput, {color: theme.colors.primaryContentText}]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.secondaryContentText}
          value={value}
          onChangeText={onChangeText}
          allowFontScaling={false}
        />
        {value.length > 0 ? (
          <View style={styles.clearIconContainer}>
            <Pressable
              style={styles.clearIcon}
              android_ripple={{color: theme.colors.rippleBackgroundColor}}
              onPress={clearValue}
              unstable_pressDelay={0}>
              <MaterialIcons
                name="close"
                color={theme.colors.secondaryContentText}
                size={px2DpY(20)}
              />
            </Pressable>
          </View>
        ) : null}
      </>
    ),
    [
      clearValue,
      onChangeText,
      placeholder,
      theme.colors.primaryContentText,
      theme.colors.rippleBackgroundColor,
      theme.colors.secondaryContentText,
      value,
    ],
  );
  return (
    <AnimatedBackgroundColorView
      style={styles.container}
      initialColor={theme.colors.surfaceVariant}
      activeColor={theme.colors.background}
      activated={activated}>
      {content}
    </AnimatedBackgroundColorView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: px2DpX(16),
    paddingRight: px2DpX(10),
    borderRadius: px2DpY(32),
    height: px2DpY(50),
    gap: px2DpX(8),
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textInput: {
    fontSize: px2DpY(16),
    lineHeight: px2DpY(24),
    height: '100%',
    flex: 1,
  },
  clearIconContainer: {
    height: px2DpY(32),
    width: px2DpY(32),
    borderRadius: px2DpY(16),
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  clearIcon: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(AnimatedBgColorSearchBar);
