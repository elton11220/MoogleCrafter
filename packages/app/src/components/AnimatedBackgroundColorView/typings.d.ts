import type {EasingFunction, StyleProp, ViewStyle} from 'react-native/types';

declare namespace AnimatedBackgroundColorView {
  interface Props {
    children?: JSX.Element | JSX.Element[] | null | (JSX.Element | null)[];
    initialColor: string;
    activeColor: string;
    activated: boolean;
    easing?: EasingFunction;
    duration?: number;
    style?: StyleProp<ViewStyle>;
  }
}
