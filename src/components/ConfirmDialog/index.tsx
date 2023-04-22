import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import type {ForwardRefRenderFunction} from 'react';
import {View, StyleSheet} from 'react-native';
import {Dialog, Portal, Text, Button} from 'react-native-paper';
import {px2DpY} from '../../utils/dimensionConverter';

const emptyCallback = () => {};

export type ConfirmDialogInstance = {
  show: () => void;
  hide: () => void;
};

const ConfirmDialog: ForwardRefRenderFunction<
  ConfirmDialogInstance,
  ConfirmDialog.Props
> = (props, ref) => {
  const {
    content,
    title,
    showConfirm = true,
    showCancel = true,
    confirmText = '确定',
    cancelText = '取消',
    onConfirm = emptyCallback,
    onCancel = emptyCallback,
    onClosed = emptyCallback,
    dismissable = false,
  } = props;
  const [visible, setVisible] = useState(false);
  const showDialog = useCallback(() => setVisible(true), []);
  const hideDialog = useCallback(() => {
    setVisible(false);
    onClosed();
  }, [onClosed]);
  const dialogContent = useMemo(
    () =>
      content instanceof Array ? (
        content.map((item, index) =>
          item === '' ? (
            <View style={styles.emptyRow} key={index} />
          ) : (
            <Text
              key={index}
              allowFontScaling={false}
              style={styles.contentText}>
              {item}
            </Text>
          ),
        )
      ) : (
        <Text allowFontScaling={false}>{content}</Text>
      ),
    [content],
  );
  useImperativeHandle(ref, () => ({
    show: showDialog,
    hide: hideDialog,
  }));
  return (
    <Portal>
      <Dialog
        visible={visible}
        dismissable={dismissable}
        onDismiss={hideDialog}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>{dialogContent}</Dialog.Content>
        <Dialog.Actions>
          {showCancel ? <Button onPress={onCancel}>{cancelText}</Button> : null}
          {showConfirm ? (
            <Button onPress={onConfirm}>{confirmText}</Button>
          ) : null}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  emptyRow: {
    height: px2DpY(8),
    width: '100%',
  },
  contentText: {
    fontSize: px2DpY(14),
    lineHeight: px2DpY(19),
  },
});

export default memo(forwardRef(ConfirmDialog));
