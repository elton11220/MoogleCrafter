import type {StyleProp, ViewStyle} from 'react-native';

declare namespace Divider {
  interface Props {
    title?: string;
    textAlign?: 'center' | 'left';
    lineStyle?: 'solid' | 'dashed' | 'dotted';
    showLine?: boolean;
    style?: StyleProp<ViewStyle>;
  }
}
