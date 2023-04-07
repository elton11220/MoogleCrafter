import {memo} from 'react';
import type {FC} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Button, Dialog, Portal, Text, useTheme} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {px2DpY} from '../../utils/dimensionConverter';
import type {DefaultLightTheme} from '../../config/themes/defaultTheme';

const UpdateDialog: FC<UpdateDialog.Props> = props => {
  const {
    allowSkip = false,
    rightText,
    content = '',
    visible,
    onDismiss,
    onConfirm,
  } = props;
  const theme = useTheme<typeof DefaultLightTheme>();
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} dismissable={allowSkip}>
        <Dialog.Icon
          size={px2DpY(24)}
          icon={({size, color}) => (
            <MaterialIcons name="system-update" size={size} color={color} />
          )}
        />
        <Dialog.Title style={styles.title} allowFontScaling={false}>
          发现新版本
        </Dialog.Title>
        <Dialog.Content>
          <View style={styles.sectionHeader}>
            <Text allowFontScaling={false} style={styles.sectionHeaderTitle}>
              关于新版本
            </Text>
            <Text
              allowFontScaling={false}
              style={[styles.sectionHeaderRight, {color: theme.colors.primary}]}
              numberOfLines={1}>
              {rightText}
            </Text>
          </View>
          <ScrollView style={styles.scrollContentView}>
            {content instanceof Array ? (
              content.map((item, index) => (
                <Text
                  key={index}
                  allowFontScaling={false}
                  style={[
                    styles.contentText,
                    {
                      color: theme.colors.secondaryContentText,
                    },
                  ]}
                  textBreakStrategy="simple">
                  {`${index + 1}. ${item}`}
                </Text>
              ))
            ) : (
              <Text
                allowFontScaling={false}
                style={[
                  styles.contentText,
                  {
                    color: theme.colors.secondaryContentText,
                  },
                ]}
                textBreakStrategy="simple">
                {content}
              </Text>
            )}
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          {allowSkip ? <Button onPress={onDismiss}>暂不更新</Button> : null}
          <Button onPress={onConfirm}>立即更新</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: px2DpY(24),
    lineHeight: px2DpY(32),
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionHeaderTitle: {
    fontSize: px2DpY(14),
    fontWeight: 'bold',
  },
  sectionHeaderRight: {
    fontSize: px2DpY(14),
    fontWeight: 'bold',
  },
  scrollContentView: {
    marginTop: px2DpY(5),
    paddingLeft: px2DpY(14),
  },
  contentText: {
    fontSize: px2DpY(13),
    lineHeight: px2DpY(20),
  },
});

export default memo(UpdateDialog);
