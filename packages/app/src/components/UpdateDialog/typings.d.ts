declare namespace UpdateDialog {
  interface Props {
    allowSkip?: boolean;
    rightText?: string;
    content?: string[] | string;
    visible: boolean;
    onDismiss: () => void;
    onConfirm: () => void;
  }
}
