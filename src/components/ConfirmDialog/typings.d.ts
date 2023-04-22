declare namespace ConfirmDialog {
  interface Props {
    content: string[] | string;
    title: string;
    showConfirm?: boolean;
    showCancel?: boolean;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClosed?: () => void;
    dismissable?: boolean;
  }
}
