declare namespace DrawerActions {
  interface Props {
    cancelText?: string;
    okText?: string;
    onCancel?: () => void;
    onConfirm?: () => void;
  }
}
