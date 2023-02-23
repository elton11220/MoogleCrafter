declare namespace Drawer {
  interface Props {
    visible: boolean;
    children: JSX.Element[] | JSX.Element;
    footer?: JSX.Element[] | JSX.Element;
    onClose: () => void;
    closeOverlayClick?: boolean;
  }
}
