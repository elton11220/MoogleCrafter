declare namespace Drawer {
  interface Props {
    children: JSX.Element[] | JSX.Element;
    footer?: JSX.Element[] | JSX.Element;
    onClosed: () => void;
    closeOverlayClick?: boolean;
  }
}
