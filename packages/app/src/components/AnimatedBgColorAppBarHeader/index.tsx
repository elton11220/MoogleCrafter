import type {FC} from 'react';
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX} from '../../utils/dimensionConverter';
import AnimatedBackgroundColorView from '../AnimatedBackgroundColorView';
import type {AnimatedBgColorAppBarHeader as AnimatedBgColorAppBarHeaderType} from './typings';

const AnimatedBgColorAppBarHeader: FC<
  AnimatedBgColorAppBarHeaderType.Props
> = props => {
  const {children, activated = false, style: restStyle} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  const insets = useSafeAreaInsets();
  return (
    <AnimatedBackgroundColorView
      initialColor={theme.colors.background}
      activeColor={theme.colors.surfaceVariant}
      activated={activated}
      style={[
        styles.container,
        {paddingTop: insets.top, height: 64 + insets.top},
        restStyle,
      ]}>
      {children}
    </AnimatedBackgroundColorView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: px2DpX(8),
    gap: px2DpX(10),
  },
});

export default AnimatedBgColorAppBarHeader;
