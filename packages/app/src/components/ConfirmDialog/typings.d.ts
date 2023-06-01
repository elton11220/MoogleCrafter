declare namespace ConfirmDialog {
  interface Props {
    content: string[] | string | JSX.Element;
    title: string;
    showConfirm?: boolean;
    showCancel?: boolean;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    onClosed?: () => void;
    dismissable?: boolean;
    extraAction?: JSX.Element;
  }
}
