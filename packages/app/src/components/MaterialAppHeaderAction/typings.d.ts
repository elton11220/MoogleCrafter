import type {StyleProp, ViewStyle} from 'react-native/types';

declare namespace MaterialAppHeaderAction {
  interface Props {
    size?: number;
    iconSize?: number;
    iconColor?: string;
    style?: StyleProp<ViewStyle>;
    initAnimation?: boolean;
    hide?: boolean;
    useIconFont?: boolean;
    onPress: () => void;
    icon: string;
  }
}
