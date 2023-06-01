import type {FC} from 'react';
import {memo} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';
import {px2DpX, px2DpY} from '../../utils/dimensionConverter';
import type {ListSection as ListSectionType} from './typings';

const ListSection: FC<ListSectionType.Props> = props => {
  const {title, children, contentContainerStyle} = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <View style={styles.container}>
      {title ? (
        <View style={styles.titleContainer}>
          <Text
            allowFontScaling={false}
            style={[
              styles.titleText,
              {
                color: theme.colors.primary,
              },
            ]}>
            {title}
          </Text>
        </View>
      ) : null}
      <View
        style={[
          styles.contentContainer,
          {
            backgroundColor: theme.colors.secondaryContainer,
          },
          contentContainerStyle,
        ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  titleContainer: {
    paddingVertical: px2DpY(18),
    paddingHorizontal: px2DpX(36),
  },
  titleText: {
    fontSize: px2DpY(14),
  },
  contentContainer: {
    marginHorizontal: px2DpX(18),
    borderRadius: px2DpY(15),
    overflow: 'hidden',
    marginBottom: px2DpY(10),
  },
});

export default memo(ListSection);
