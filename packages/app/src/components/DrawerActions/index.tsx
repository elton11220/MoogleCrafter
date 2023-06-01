import {View, StyleSheet, Pressable, Text} from 'react-native';
import type {FC} from 'react';
import {px2DpY, px2DpX} from '../../utils/dimensionConverter';
import {useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';

const DrawerActions: FC<DrawerActions.Props> = props => {
  const {cancelText, okText, onCancel, onConfirm} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <View style={styles.btnContainer}>
      <View style={[styles.btnMask, styles.leftBtn]}>
        <Pressable
          onPress={onCancel}
          android_ripple={{color: theme.colors.rippleBackgroundColor}}
          style={[
            styles.btn,
            {backgroundColor: theme.colors.secondaryContainer},
          ]}>
          <Text
            allowFontScaling={false}
            style={[styles.btnTitle, {color: theme.colors.primaryContentText}]}>
            {cancelText ?? '重置'}
          </Text>
        </Pressable>
      </View>
      <View style={[styles.btnMask, styles.rightBtn]}>
        <Pressable
          onPress={onConfirm}
          android_ripple={{color: theme.colors.rippleBackgroundColor}}
          style={[styles.btn, {backgroundColor: theme.colors.primary}]}>
          <Text
            allowFontScaling={false}
            style={[styles.btnTitle, {color: theme.colors.background}]}>
            {okText ?? '保存'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    paddingTop: px2DpY(10),
    paddingBottom: px2DpY(30),
    paddingLeft: px2DpX(40),
    paddingRight: px2DpX(40),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnMask: {
    flexGrow: 1,
    height: px2DpY(40),
    overflow: 'hidden',
  },
  btn: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  leftBtn: {
    borderTopLeftRadius: px2DpY(20),
    borderBottomLeftRadius: px2DpY(20),
  },
  rightBtn: {
    borderTopRightRadius: px2DpY(20),
    borderBottomRightRadius: px2DpY(20),
  },
  btnTitle: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(20),
  },
});

export default DrawerActions;
