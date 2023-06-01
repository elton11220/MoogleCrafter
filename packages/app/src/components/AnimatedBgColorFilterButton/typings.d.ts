import type {StyleProp, ViewStyle} from 'react-native/types';

declare namespace AnimatedBgColorFilterButton {
  interface Props {
    activated: boolean;
    activatedBg: boolean;
    onPress: () => void;
    activatedIconColor?: string;
    activatedContainerColor?: string;
    deactivatedIconColor?: string;
    deactivatedContainerColor?: string;
    iconSize?: number;
    size?: number;
    style?: StyleProp<ViewStyle>;
  }
}
