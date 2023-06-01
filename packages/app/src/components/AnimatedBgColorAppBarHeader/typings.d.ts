import type {StyleProp, ViewStyle} from 'react-native/types';

declare namespace AnimatedBgColorAppBarHeader {
  interface Props {
    children: JSX.Element | (JSX.Element | null)[];
    activated?: boolean;
    label?: string;
    showBackAction?: boolean;
    onBack?: () => void;
    style?: StyleProp<ViewStyle>;
  }
}
